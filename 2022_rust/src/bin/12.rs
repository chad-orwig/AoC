use std::{collections::HashMap, cmp::Reverse, ops::Add};

use lib::{inputs::d12::PRIMARY, utils::{Searchable, search}};
use num::{Signed, abs};

#[derive(PartialEq, Eq, Hash, Debug)]
struct State {
  loc: (i64, i64),
  terrain: char,
  steps: i64,
  steps_to_finish: i64,
}

impl Searchable<(i64, i64), Reverse<i64>> for State {
    fn key(&self) -> (i64, i64) {
      self.loc
    }

    fn priority(&self) -> Reverse<i64> {
        Reverse(self.steps)
    }

    fn finished(&self) -> bool {
        self.steps_to_finish == 0
    }
}

fn point_diff<T: Copy + Signed>(a: &(T, T), b: &(T, T)) -> T 
  {
    let x: T = (a.0 - b.0).into();
    let y: T = (a.1 - b.1).into();

    abs(x) + abs(y)
  }

fn add_point<T: Add<Output = T> + Copy> (a: &(T, T), b: &(T, T)) -> (T, T) {
  (a.0 + b.0, a.1 + b.1)
}

fn main() {
  let start:(i64, i64) = (0, 0);
  let end: (i64, i64) = (0, 0);
  let terrain: HashMap<(i64,i64), char> = PRIMARY.split("\n")
    .enumerate()
    .flat_map(|(y, r)| {
      r.char_indices()
        .map(move |(x, c)| {
          let height = match c {
            'S' => 'a',
            'E' => 'z',
            _ => c
          };
          ((x as i64,y as i64),height)
        }
      )
    })
    .collect();

    let start_and_end: HashMap<char, (i64,i64)> = PRIMARY.split("\n")
    .enumerate()
    .flat_map(|(y, r)| {
      r.char_indices()
        .filter(|(_,c)| { *c == 'S' || *c == 'E'})
        .map(move|(x, c)| {
          (c, (x as i64,y as i64))
        }
      )
    })
    .collect();

  let start = start_and_end.get(&'S').unwrap();
  let end = start_and_end.get(&'E').unwrap();

  let starting_state = State {
    loc: start.clone(),
    terrain: terrain.get(&start).unwrap().to_owned(),
    steps: 0,
    steps_to_finish: point_diff(&start, &end),
  };
  let up: (i64, i64) = (0, -1);
  let down: (i64, i64) = (0, 1);
  let left: (i64, i64) = (-1, 0);
  let right: (i64, i64) = (1, 0);

  let next_states = |s: &State| -> Vec<State> {
    [up,down,left,right].into_iter()
      .map(|d| add_point(&d, &s.loc))
      .filter(|loc| terrain.contains_key(loc))
      .map(|loc| {
        let terrain = terrain.get(&loc).unwrap();
        (loc, terrain)
      })
      .filter(|(_,t)| {
        let diff = s.terrain as i16 - **t as i16;
        match diff {
          -1.. => true,
          _ => false,
        }
      })
      .map(|(loc, t)| State {
        loc: loc.clone(),
        terrain: t.to_owned(),
        steps: s.steps + 1,
        steps_to_finish: point_diff(&loc, &end),
      })
      .collect()
  };
  println!("start: {:?}; end: {:?}", start, end);
  let p1 = search(vec![starting_state], next_states).unwrap();

  println!("{:?}", p1);

  let a_locs = terrain.iter()
    .filter(|(loc, c)| **c == 'a')
    .map(|(loc,c)| State {
      loc: loc.clone(),
      terrain: c.to_owned(),
      steps: 0,
      steps_to_finish: point_diff(loc, &end),
    })
    .collect();

    let p2 = search(a_locs, next_states).unwrap();

    println!("{:?}", p2);

}