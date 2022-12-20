use std::{collections::HashSet, hash::Hash, cell::Cell};

use lib::{inputs::d19::*, search::{Searchable, search}};
use num::{FromPrimitive, ToPrimitive};
use num_derive::{FromPrimitive, ToPrimitive};
use crate::Mat::*;

const INITIAL_BEST: f64 = 0.3;
static mut BEST: f64 = INITIAL_BEST;

#[derive(Debug, Clone, Copy, FromPrimitive, ToPrimitive, PartialEq, Eq, Hash)]
enum Mat {
  Ore = 0,
  Clay = 1,
  Obsidian = 2,
  Geode = 3,
}

impl Mat {
  fn mat_enumerated<T>((i, v): (usize, T)) -> (Mat, T) {
    let m = FromPrimitive::from_usize(i).unwrap();

    (m, v)
  }
}

impl From<&str> for Mat {
    fn from(s: &str) -> Self {
      match s {
        "ore" => Ore,
        "clay" => Clay,
        "obsidian" => Obsidian,
        "geode" => Geode,
        x => panic!("Unknown string: '{}'", x),
      }
    }
}

#[derive(Debug, PartialEq, Eq, Hash, Clone)]
struct Blueprint {
  num: u16,
  costs: [[u16; 4]; 4],
}

#[derive(Debug, PartialEq, Eq, Hash, Clone)]
struct State {
  minutes_remaining: u64,
  minutes_used: u64,
  blueprint: Blueprint,
  robots: [u64; 4],
  materials: [u64; 4],
}

impl State {
  fn num_robots(&self, mat: &Mat) -> u64 {
    self.robots[mat.clone() as usize]
  }
  fn num_materials(&self, mat: &Mat) -> u64 {
    self.materials[mat.clone() as usize]
  }

  fn geodes_per_minute(&self) -> (u64, u64){
    if self.minutes_used == 0 {return (0,0);}
    let geodes = self.num_materials(&Geode);

    (
      geodes / self.minutes_used,
      geodes % self.minutes_used,
    )
  }

  fn geode_estimate(&self) -> u64 {
    self.materials[Geode as usize] + (self.robots[Geode as usize] * self.minutes_remaining)
  }
  fn time_to_robot(&self, robot: Mat) -> Option<u64> {
    let ri = ToPrimitive::to_usize(&robot)?;
    let cost = self.blueprint.costs[ri];

    let times = cost.iter()
      .enumerate()
      .map(|(i, c)| {
        if c == &0 { return Some(0); }
        let num_bots = self.robots[i];
        if num_bots == 0 { return None; }
        let have = self.materials[i];
        if have >= *c as u64 {return Some(0);}
        let need = *c as u64 - have;
        let mut time = need / num_bots;
        if need % num_bots > 0 {time += 1;}
        Some(time)
      })
      .collect::<Option<Vec<u64>>>()?;

    Some(times.into_iter().max().unwrap())
  }
  fn mats_after_time(&self, t: u64) -> [u64; 4] {
    self.materials.iter()
          .enumerate()
          .map(|(i, m)| m + (self.robots[i] * t))
          .collect::<Vec<_>>()
          .try_into()
          .unwrap()
  }

  fn mats_after_build(&self, r: Mat, t: u64) -> [u64; 4] {
    let mut mats = self.mats_after_time(t);

    for i in 0..4 {
      mats[i] -= self.blueprint.costs[r as usize][i] as u64;
    }
    mats
  }
  fn add_robot(&self, r: Mat) -> [u64; 4] {
    let i = ToPrimitive::to_usize(&r).unwrap();
    let mut new = self.robots.clone();
    new[i] += 1;

    return new;
  }
  fn next_states(&self) -> Vec<State> {
    let base_gpm = if self.minutes_used == 0 { INITIAL_BEST } else { INITIAL_BEST + (self.num_materials(&Geode) as f64 / self.minutes_used as f64) };
    unsafe {
      if base_gpm > BEST {
        println!("new best: {}", base_gpm);
        BEST = base_gpm;
      }
      else if base_gpm < BEST * 0.8 {
        return vec![];
      }
    }
    let robot_times = [Ore, Clay, Obsidian, Geode].into_iter()
      .map(|r| (r, self.time_to_robot(r)))
      .filter(|(_, t)| t.is_some())
      .map(|(r, t)| (r, t.unwrap()))
      .filter(|(_, t)| *t < self.minutes_remaining)
      .collect::<Vec<_>>();

    if robot_times.len() == 0 {
      return vec![State {
        minutes_remaining: 0,
        minutes_used: self.minutes_used + self.minutes_remaining,
        blueprint: self.blueprint.clone(),
        robots: self.robots.clone(),
        materials: self.mats_after_time(self.minutes_remaining),
      }];
    }

    return robot_times.into_iter()
      .map(|(r, t)| State {
        minutes_remaining: self.minutes_remaining - t - 1,
        minutes_used: self.minutes_used + t + 1,
        blueprint: self.blueprint.clone(),
        robots: self.add_robot(r),
        materials: self.mats_after_build(r, t + 1),
      })
      .collect();
  }
}

impl Searchable<State, (u64, u64)> for State {

  fn key(&self) -> State {
      self.clone()
  }
  fn priority(&self) -> (u64, u64) {
    (
      self.minutes_remaining,
      self.num_materials(&Geode),
    )
  }

  fn finished(&self) -> bool {
      self.minutes_remaining == 0
  }
}

impl From<&str> for Blueprint {
  fn from(s: &str) -> Self {
    let (name_str, rest) = s.split_once(": ")
      .expect("bad colon split");
    let num = name_str.strip_prefix("Blueprint ")
      .expect("Didn't start with Blueprint")
      .parse()
      .expect("Wasn't a number");
    let mut costs = [[0; 4]; 4];

    rest.strip_suffix(".")
      .expect("Doesn't end in period")
      .split(". ")
      .for_each(|line| {

        let (robot_str, cost_str) = line.split_once(" costs ")
          .expect("bad costs split");

        let robot = Mat::from(robot_str.strip_prefix("Each ")
          .unwrap()
          .strip_suffix(" robot")
          .unwrap());

        let robot_i = robot as usize;

        cost_str.split(" and ")
          .map(|c| c.split_once(" ").expect("bad cost split"))
          .map(|(num, mat)| (num.parse().unwrap(), Mat::from(mat)))
          .for_each(|(num, mat)| {
            costs[robot_i][mat as usize] = num;
          });
      });

    Blueprint { num, costs }
  }
}

fn number_we_could_create(mats: &[u64; 4], costs: &[u16; 4]) -> (u64, usize)  {
  (0..4)
    .filter(|i| costs[*i] > 0)
    .map(|i| (mats[i] / costs[i] as u64, i))
    .reduce(|a,b| if a.0 < b.0 { a } else { b })
    .unwrap()
}

fn main () {
  let blueprints = PRIMARY.split("\n")
    .map(Blueprint::from)
    .collect::<Vec<_>>();

  let initial_states = blueprints.iter()
    .map(|blueprint| {
      State {
        minutes_remaining: 24,
        minutes_used: 0,
        blueprint: blueprint.clone(),
        robots: [1, 0, 0, 0],
        materials: [0, 0, 0, 0],
      }
    })
    .collect::<Vec<_>>();
  //   .nth(0).unwrap();

  // let options = state.next_states()[1]
  //   .next_states()[1]
  //   .next_states();

  // options.iter()
  //   .for_each(|s| println!("{:?}", s));
  let p1 = initial_states.iter()
    .map(|init| {
      unsafe { BEST = INITIAL_BEST }
      search(vec![init.clone()], State::next_states, None)
    })
    .map(Option::unwrap)
    .map(|s| s.blueprint.num as u64 * s.num_materials(&Geode))
    .sum::<u64>();
  println!("{:?}", p1);

  let p2 = initial_states[0..3].into_iter()
    .map(|s| {
      let mut new_s = s.clone();
      new_s.minutes_remaining = 32;
      new_s
    })
    .map(|s| {
      println!("part 2 attempt");
      unsafe { BEST = INITIAL_BEST }
      search(vec![s], State::next_states, None)
    })
    .map(Option::unwrap)
    .map(|s| s.num_materials(&Geode))
    .reduce(|a,b| a * b)
    .unwrap();

  println!("{}", p2);
}