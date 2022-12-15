use std::{collections::HashMap, vec::IntoIter, cmp::{min, max}};

use lib::{inputs::d14::PRIMARY, grid::Point};

use crate::Material::*;

#[derive(Default, Clone, Debug)]
pub enum Material {
  Rock,
  Sand,
  #[default]
  Air,
}

impl Default for &Material {
    fn default() -> Self {
        &Air
    }
}

struct Cavern {
  map: HashMap<Point<i64>,Material>,
  sand_count: i64,
  min: Point<i64>,
  max: Point<i64>,
}

impl Cavern {
  pub const DIRECTIONS: [Point<i64>; 3] = [
    Point{ x: 0, y: 1 },
    Point{ x: -1, y: 1 },
    Point{ x: 1, y: 1 },
  ];
  fn add_sand(&mut self, source: Point<i64>) -> bool {
    let mut current = Some(source.clone());
    let mut prev: Option<Point<i64>> = None;
    while matches!(current, Some(_)) && current.as_ref().unwrap().y <= self.max.y + 2 {
      prev = current;
      current = Cavern::DIRECTIONS
      .iter()
      .map(|p| prev.as_ref().unwrap() + p)
      .map(|p| {
        let mat = if p.y == self.max.y + 2 {&Rock} else {self.map.get(&p).unwrap_or_default()};
        (p, mat)
      }).filter(|(_,mat)| matches!(mat, Air))
      .map(|(p,_)| p)
      .next();
    }
    match current {
      None => {
        let p = prev.unwrap();
        let x = p.x.clone();
        let y = p.y.clone();
        self.map.insert(p, Sand);
        self.sand_count += 1;
        !(x == 500 && y == 0)
      },
      Some(_) => false
    }
  }
}

impl std::fmt::Debug for Cavern {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {

      let minx = self.min.x.clone();
      let maxy = self.max.y.clone() + 2;
      let maxx = self.max.x.clone();
      f.write_str("====================\n")?;
      for y in 0..=maxy {
        let mut row = String::with_capacity(maxx as usize - minx as usize);
        for x in minx..=maxx {
          match self.map.get(&Point::from_tuple((x, y))).unwrap_or_default() {
            Rock => row.push('#'),
            Sand => row.push('o'),
            Air => row.push('.'),
          }
        }
        row.push('\n');
        f.write_str(&row)?;
      }

      f.write_str("====================")
    }
}

impl FromIterator<Point<i64>> for Cavern {
    fn from_iter<T: IntoIterator<Item = Point<i64>>>(iter: T) -> Self {
      let map: HashMap<Point<i64>, Material> = iter.into_iter().map(|p|(p, Rock)).collect();
      let min_x = map.keys().map(|p| p.x).min().unwrap();
      let max_x = map.keys().map(|p| p.x).max().unwrap();
      let min_y = map.keys().map(|p| p.y).min().unwrap();
      let max_y = map.keys().map(|p| p.y).max().unwrap();
      Cavern { map, sand_count: 0, min: Point { x: min_x, y: min_y }, max: Point { x: max_x, y: max_y } }
    }
}

fn line_to_points(line: &str) -> IntoIter<Point<i64>> {
  line.split(" -> ")
    .map(|point_line| {
      let mut i = point_line.split(",");
      let x = i.next().map(str::parse::<i64>).unwrap().unwrap();
      let y = i.next().map(str::parse::<i64>).unwrap().unwrap();
      if i.next().is_some() { panic!("weird split on a point")};
      Point { x, y }
    })
    .fold(Vec::<Point<i64>>::new(),|mut acc, p| {
      match acc.last() {
        None => {
          acc.push(p);
          return acc;
        },
        Some(prev) => {
          let minx = min(p.x, prev.x);
          let maxx = max(p.x, prev.x);
          let miny = min(p.y, prev.y);
          let maxy = max(p.y, prev.y);
          let x_diff = maxx - minx;
          let y_diff = maxy - miny;
          for x_offset in 0..=x_diff {
            for y_offset in 0..=y_diff {
              if x_offset == 0 && y_offset == 0 { continue;}
              let p = Point { x: minx + x_offset, y: miny + y_offset };
              acc.push(p);
            }
          }
          acc.push(p);
          return acc;
        }
      }
    })
    .into_iter()
}

fn main() {
  let mut cavern = PRIMARY
    .split("\n")
    .flat_map(line_to_points)
    .collect::<Cavern>();

  while cavern.add_sand(Point::from_tuple((500,0))) {
  }


  println!("{:?}", cavern);
  println!("{:?}", cavern.sand_count);
}