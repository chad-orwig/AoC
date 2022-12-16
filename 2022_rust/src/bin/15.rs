use std::{collections::HashMap, ops::RangeInclusive, cmp::{min, max}};
use crate::Type::*;

use lib::inputs::d15::*;
use num::abs;
use regex::Regex;

enum Type {
    Sensor((i64, i64)),
    Beacon,
}

impl Type {
  fn get_nearest_beacon(&self) -> &(i64, i64) {
    match self {
      Sensor(b) => b,
      Beacon => panic!("Can't get nearest Beacon of Beacon"),
    }
  }
}

fn eliminations_on_row(sensor_loc: &(i64, i64), nearest_beacon: &(i64, i64), row: i64) -> Option<RangeInclusive<i64>> {
  let distance_to_beacon = abs(sensor_loc.0 - nearest_beacon.0) + abs(sensor_loc.1 - nearest_beacon.1);
  let distance_to_row = abs(sensor_loc.1 - row);
  
  let diff = distance_to_beacon - distance_to_row;
  if diff < 0 { return None; }
  let min = sensor_loc.0 - diff;
  let max = sensor_loc.0 + diff;
  return Some(min..=max)
}

fn combine_range(r1: &RangeInclusive<i64>, r2: &RangeInclusive<i64>) -> Option<RangeInclusive<i64>> {
  let min = min(r1.start(), r2.start());
  let max = max(r1.end(), r2.end());

  if r1.contains(r2.start())
    || r2.contains(r1.start())
    || r1.contains(r2.end())
    || r2.contains(r1.end())
    { return Some(min.clone()..=max.clone()) }

  None
}

fn range_folder(mut curr: Vec<RangeInclusive<i64>>, r2: RangeInclusive<i64>) -> Vec<RangeInclusive<i64>> {
  let smash = curr
    .iter()
    .enumerate()
    .map(|(i, r1)| (i, combine_range(r1, &r2)))
    .find(|(_, r) | matches!(r, Some(_)));

  match smash {
      None => {
        curr.push(r2);
        return curr;
      },
      Some((i, Some(new_range))) => {
        curr.remove(i);
        return range_folder(curr, new_range);
      },
      _ => panic!("wtf")
  }
}

fn find_possible(sensors: &Vec<(&(i64, i64), &(i64, i64))>, row: i64, min: &i64, max: &i64) -> Option<(i64, i64)> {
  let mut rs = sensors.iter()
    .map(|(s, b)|eliminations_on_row(s, b, row))
    .filter(Option::is_some)
    .map(|o| o.unwrap())
    .fold(Vec::new(), range_folder)
    .into_iter()
    .filter(|r| !(r.end() < min))
    .filter(|r| !(r.start() > max))
    .collect::<Vec<_>>();
  rs.sort_by(|r1, r2| r1.start().cmp(r2.start()));
  match rs.len() {
    1 => None,
    2 => Some((rs[0].end() + 1, row)),
    _ => panic!("shouldn't have any other length"),
  }

}

fn main() {
  let regex = Regex::new(r"^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$").unwrap();
  let row = 2000000;
  let cavern = PRIMARY.split("\n")
    .map(|l| regex.captures(l).expect(l))
    .map(|c| ((c[1].parse::<i64>().unwrap(), c[2].parse::<i64>().unwrap()), (c[3].parse::<i64>().unwrap(), c[4].parse::<i64>().unwrap())))
    .fold(HashMap::new(), |mut map, (sensor, nearest_beacon)| {
      map.insert(sensor, Sensor(nearest_beacon.clone()));
      map.insert(nearest_beacon, Beacon);
      map
    });

  let sensors = cavern.iter()
    .filter(|(_, t)| matches!(t, Sensor(_)))
    .map(|(p, t)| (p, t.get_nearest_beacon()))
    .collect::<Vec<_>>();

  let num_becons_on_row = cavern.iter()
    .filter(|(_, t)| matches!(t, Beacon))
    .filter(|((_, y), _)| y == &row)
    .count();

  let p1: usize = sensors.iter()
    .map(|(s, b)|eliminations_on_row(s, b, row))
    .filter(Option::is_some)
    .map(|o| o.unwrap())
    .fold(Vec::new(), range_folder)
    .into_iter()
    .map(|r|r.count())
    .sum();
  println!("{:?}", p1 - num_becons_on_row);

  let min = 0;
  let max = 4000000;
  let p2 = (min..=max)
    .map(|row| find_possible(&sensors, row, &min, &max))
    .find(|r| matches!(r, Some(_)))
    .unwrap()
    .unwrap();

  let frequency = (p2.0 * 4000000) + p2.1;

  println!("{}", frequency);

}
