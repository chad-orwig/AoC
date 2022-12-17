use std::{collections::{HashSet, HashMap, BTreeMap, BTreeSet, hash_map::DefaultHasher}, cmp::min, hash::{Hash, Hasher}, cell::Cell};

use lib::{inputs::d16::*, search::{Searchable, search}};
use regex::Regex;

#[derive(PartialEq, Eq, Hash, Debug)]
struct State {
  open_tunnels: BTreeSet<String>,
  remaining_time: u64,
  time_used: u64,
  pressure_released: u64,
  loc: String,

}

#[derive(PartialEq, Eq, Hash, Debug)]
struct State2 {
  open_tunnels: BTreeSet<String>,
  remaining_time: (u64, u64),
  time_used: (u64,u64),
  pressure_released: u64,
  loc: (String, String),

}

impl Searchable<u64, (u64, u64)> for State {
    fn key(&self) -> u64 {
        let mut hasher = DefaultHasher::new();
        self.hash(&mut hasher);
        hasher.finish()
    }

    fn priority(&self) -> (u64, u64) {
      if self.time_used == 0 { return (0,0)}
      (
        self.pressure_released / self.time_used,
        self.pressure_released % self.time_used,
      )
    }

    fn finished(&self) -> bool {
        self.remaining_time == 0
    }
}

impl State2 {
  fn total_remaining_time(&self) -> u64 {
    self.remaining_time.0 + self.remaining_time.1
  }
  fn total_time_used(&self) -> u64 {
    self.time_used.0 + self.time_used.1
  }
}

impl Searchable<u64, (u64, u64)> for State2 {
  fn key(&self) -> u64 {
      let mut hasher = DefaultHasher::new();
      self.hash(&mut hasher);
      hasher.finish()
  }

  fn priority(&self) -> (u64, u64) {
    let time_used = self.total_time_used();
    if time_used == 0 { return (0,0); }
    (
      self.pressure_released / time_used,
      self.pressure_released % time_used,
    )
  }

  fn finished(&self) -> bool {
      self.total_remaining_time() == 0
  }
}

#[derive(PartialEq, Eq, Hash)]
struct TotalRouteState<'a> {
  source: String,
  destinations: BTreeMap<String, u64>,
  tunnel_count: usize,
  direct_route_map: &'a BTreeMap<String, BTreeSet<String>>,
}

impl<'a> TotalRouteState<'a> {
  fn new(source: String, direct_route_map: &'a BTreeMap<String, BTreeSet<String>>, tunnel_count: usize) -> Self {
    let destinations = direct_route_map.get(&source).unwrap()
      .iter()
      .map(|d| (d.clone(), 1))
      .collect();

    TotalRouteState { source, destinations, tunnel_count, direct_route_map }
  }
}

impl<'a> Searchable<String, usize> for TotalRouteState<'a> {
    fn key(&self) -> String {
      self.destinations.keys()
        .map(String::clone)
        .collect::<Vec<_>>()
        .join(", ")
    }

    fn priority(&self) -> usize {
        self.destinations.len()
    }

    fn finished(&self) -> bool {
        self.destinations.len() == self.tunnel_count - 1
    }
}

fn find_next_route_states<'a> (curr: &TotalRouteState<'a>) -> Vec<TotalRouteState<'a>> {
  let mut new_paths = curr.destinations.iter()
    .flat_map(|(source, t)|
      curr.direct_route_map[source]
        .iter()
        .filter(|s| s != &&curr.source)
        .filter(|s| !curr.destinations.contains_key(*s))
        .map(|s|(s.clone(), t.clone() + 1))
        
    )
    .fold(BTreeMap::new(), |mut acc, (k,d)| {
      let curr = acc.get(&k).unwrap_or(&d);
      let v = min(curr, &d);
      acc.insert(k, v.clone());
      acc
    });
  let mut old_paths = curr.destinations.clone();
  new_paths.append(&mut old_paths);
  
  return vec![TotalRouteState {
    source:curr.source.clone(),
    destinations:new_paths,
    tunnel_count: curr.tunnel_count.clone(),
    direct_route_map: curr.direct_route_map
   }];
}

fn find_all_routes(init: TotalRouteState) -> (String, BTreeMap<String, u64>) {

    let completed = search(vec![init], find_next_route_states, None).unwrap();
    
    return (completed.source, completed.destinations);
}

fn main() {
  let route_regex = Regex::new(r"Valve (\w+) has flow rate=\d+; tunnels? leads? to valves? (.*)$").unwrap();
  let flow_regex = Regex::new(r"Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? .*$").unwrap();
  
  let direct_routes = PRIMARY.split("\n")
    .map(|line| route_regex.captures(line).expect(line))
    .map(|c|(String::from(&c[1]), String::from(&c[2])))
    .map(|(v, l)| (v, l.split(", ").map(String::from).collect::<BTreeSet<String>>()))
    .collect::<BTreeMap<_, _>>();

  let flow_rates = PRIMARY.split("\n")
    .map(|line| flow_regex.captures(line).expect(line))
    .map(|c|(String::from(&c[1]), c[2].parse::<u64>().unwrap()))
    .collect::<HashMap<_, _>>();

  let active_valves = flow_rates.iter()
    .filter(|(_, r)| **r > 0)
    .map(|(k,_)| k.clone())
    .collect::<HashSet<_>>();

  let tunnel_count = direct_routes.len();

  let total_routes: HashMap<String, BTreeMap<String, u64>> = direct_routes.keys()
    .map(|s| TotalRouteState::new(s.clone(), &direct_routes, tunnel_count))
    .map(find_all_routes)
    .map(|(k, t)| {
      let new_tree = t.into_iter()
      .filter(|(k,_)| active_valves.contains(k))
      .collect();
      (k, new_tree)
    })
    .collect();

  let find_next_states = |curr: &State| {
    let routes_from_source = total_routes.get(&curr.loc).unwrap();
    let next_states = total_routes.keys()
      .filter(|k| **k != curr.loc)
      .filter(|k| !curr.open_tunnels.contains(*k))
      .map(|k| (k, routes_from_source.get(k)))
      .filter(|(k, o)| matches!(o, Some(_)))
      .map(|(k, o)| (k, o.unwrap()))
      .filter(|(_, t)| *t < &curr.remaining_time)
      .map(|(new_dest, time) | {
        let total_t = time + 1;
        let mut open_tunnels = curr.open_tunnels.clone();
        open_tunnels.insert(new_dest.clone());
        let remaining_time = curr.remaining_time - total_t;
        let pressure_released = curr.pressure_released + (remaining_time * flow_rates.get(new_dest).unwrap());
        let time_used = curr.time_used + total_t;
        State {
          open_tunnels,
          remaining_time,
          time_used,
          pressure_released,
          loc: new_dest.clone(),
        }
      })
      .collect::<Vec<_>>();

    match next_states.len() {
      0 => vec![State {
        open_tunnels: curr.open_tunnels.clone(),
        remaining_time: 0,
        time_used: curr.time_used + curr.remaining_time,
        pressure_released: curr.pressure_released.clone(),
        loc: curr.loc.clone(),
      }],
      _ => next_states
    }
  };

  let starting_state = State {
    open_tunnels: BTreeSet::new(),
    remaining_time: 30,
    pressure_released: 0,
    time_used: 0,
    loc: String::from("AA"),
  };

  let p1 = search(vec![starting_state], find_next_states, None);

  println!("{:?}", p1);


  let least_total_time: Cell<u64> = Cell::new(26 + 26);

  let find_next_states_2 = |curr: &State2| {
    let total_time = curr.total_remaining_time();

    if total_time < least_total_time.get() {
      println!("{}", total_time);
      least_total_time.set(total_time);
    }
    
    let routes_from_source_0 = total_routes.get(&curr.loc.0).unwrap();
    let routes_from_source_1 = total_routes.get(&curr.loc.1).unwrap();
    let next_states_0 = total_routes.keys()
      .filter(|k| **k != curr.loc.0)
      .filter(|k| !curr.open_tunnels.contains(*k))
      .map(|k| (k, routes_from_source_0.get(k)))
      .filter(|(k, o)| matches!(o, Some(_)))
      .map(|(k, o)| (k, o.unwrap()))
      .filter(|(_, t)| *t < &curr.remaining_time.0)
      .map(|(new_dest, time) | {
        let total_t = time + 1;
        let mut open_tunnels = curr.open_tunnels.clone();
        open_tunnels.insert(new_dest.clone());
        let remaining_time = curr.remaining_time.0 - total_t;
        let pressure_released = curr.pressure_released + (remaining_time * flow_rates.get(new_dest).unwrap());
        let time_used = curr.time_used.0 + total_t;
        State2 {
          open_tunnels,
          remaining_time: (remaining_time, curr.remaining_time.1.clone()),
          time_used: (time_used, curr.time_used.1.clone()),
          pressure_released,
          loc: (new_dest.clone(), curr.loc.1.clone()),
        }
      });
    
    let next_states_1 = total_routes.keys()
      .filter(|k| **k != curr.loc.1)
      .filter(|k| !curr.open_tunnels.contains(*k))
      .map(|k| (k, routes_from_source_1.get(k)))
      .filter(|(k, o)| matches!(o, Some(_)))
      .map(|(k, o)| (k, o.unwrap()))
      .filter(|(_, t)| *t < &curr.remaining_time.1)
      .map(|(new_dest, time) | {
        let total_t = time + 1;
        let mut open_tunnels = curr.open_tunnels.clone();
        open_tunnels.insert(new_dest.clone());
        let remaining_time = curr.remaining_time.1 - total_t;
        let pressure_released = curr.pressure_released + (remaining_time * flow_rates.get(new_dest).unwrap());
        let time_used = curr.time_used.1 + total_t;
        State2 {
          open_tunnels,
          remaining_time: (curr.remaining_time.0.clone(), remaining_time),
          time_used: (curr.time_used.0.clone(), time_used),
          pressure_released,
          loc: (curr.loc.0.clone(), new_dest.clone()),
        }
      });

    let next_states = next_states_0.chain(next_states_1).collect::<Vec<_>>();

    match next_states.len() {
      0 => vec![State2 {
        open_tunnels: curr.open_tunnels.clone(),
        remaining_time: (0,0),
        time_used: (curr.time_used.0 + curr.remaining_time.0, curr.time_used.1 + curr.remaining_time.1),
        pressure_released: curr.pressure_released.clone(),
        loc: curr.loc.clone(),
      }],
      _ => next_states
    }
    
  };

  let starting_state_2 = State2 {
    open_tunnels: BTreeSet::new(),
    remaining_time: (26, 26),
    pressure_released: 0,
    time_used: (0, 0),
    loc: (String::from("AA"), String::from("AA")),
  };

  let p2 = search(vec![starting_state_2], find_next_states_2, Some((4000000, 2000000)));

  println!("{:?}", p2);

}