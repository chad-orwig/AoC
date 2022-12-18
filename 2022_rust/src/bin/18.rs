use std::collections::{HashSet, HashMap};

use lib::inputs::d18::*;

use SteamWallType::*;
use Axis::*;
enum SteamWallType {
  Min,
  Max,
}

enum Axis {
  X,
  Y,
  Z,  
}
struct SteamWall {
  t: SteamWallType,
  min: Cube,
  max: Cube,
  live: HashSet<Cube>,
  blocked: HashMap<Cube, usize>,
  seen: HashSet<Cube>,
}

impl SteamWall {
  fn step(&mut self, lava: &HashSet<Cube>) {
    let live = &self.live;
    let new_points = live.clone().into_iter()
      .map(|old| {
        [-1,1].into_iter()
          .map(|amount| (Y, amount))
          .chain([-1,1].into_iter().map(|amount|(Z, amount)))
          .chain([-1,1].into_iter().map(|amount|(X, amount)))
          .map(|(axis, amount)| old.add_to_axis(&axis, amount))
          .chain([old.add_to_axis(&X, match self.t { Min => 1, Max => -1 })])
          .map(|new| (old.clone(), new))
          .collect::<Vec<_>>()
        
        
      })
      .flat_map(|v| v.into_iter())
      .filter(|(_,new)| {
        new.x >= self.min.x
        && new.x <= self.max.x + 3
        && new.y >= self.min.y - 3
        && new.y <= self.max.y + 3 
        && new.z >= self.min.z - 3
        && new.z <= self.max.z + 3
      })
      .filter(|(_,new)| !&self.seen.contains(new))
      .collect::<HashSet<_>>();
      self.live.clear();
      for (old, new) in new_points {
        if lava.contains(&new) {
          let touching_faces = 6 - old.open_sides(lava);
          self.blocked.insert(old.clone(), touching_faces);
        }
        else { self.live.insert(new.clone()); }
        self.seen.insert(new);
      }

  }
}

#[derive(Debug, PartialEq, Eq, Hash, Clone)]
struct Cube {
  x: i64,
  y: i64,
  z: i64,
}

impl Cube {
  const OFFSETS: [(i64, i64, i64); 6] = [
    (1,0,0),
    (-1,0,0),
    (0,1,0),
    (0,-1,0),
    (0,0,1),
    (0,0,-1),
  ];
  fn open_sides(&self, set: &HashSet<Cube>) -> usize {
    Cube::OFFSETS.iter()
      .map(|(x,y,z)| (x + self.x, y + self.y, z + self.z))
      .map(|(x,y,z)| Cube {x,y,z})
      .filter(|c| !set.contains(c))
      .count()
  }
  fn add_to_axis(&self, axis: &Axis, amount: i64) -> Cube {
    match axis {
     X => Cube { x: self.x + amount, y: self.y, z: self.z },
     Y => Cube { x: self.x, y: self.y + amount, z: self.z },
     Z => Cube { x: self.x, y: self.y, z: self.z + amount },
    }
  }
}

impl From<&str> for Cube {
    fn from(line: &str) -> Self {
      let [x,y,z]: [i64; 3] = line.split(",")
      .map(str::parse::<i64>)
      .map(Result::unwrap)
      .collect::<Vec<_>>()
      .try_into()
      .expect("Line doesn't split into 3 pieces");

      Cube { x, y, z }
    }
}

fn main() {
  let lava = PRIMARY.split("\n")
    .map(Cube::from)
    .collect::<HashSet<_>>();

  let open_sides = lava.iter()
    .map(|c| c.open_sides(&lava))
    .sum::<usize>();
  println!("{:?}", open_sides);

  let (x,y,z) = lava.iter()
    .fold((i64::MAX, i64::MAX, i64::MAX), |(x,y,z), c|(
      x.min(c.x),
      y.min(c.y),
      z.min(c.y),
    ));

  let min = Cube { x: x - 1, y: y - 1, z: z - 1 };

  let (x,y,z) = lava.iter()
    .fold((i64::MIN, i64::MIN, i64::MIN), |(x,y,z), c|(
      x.max(c.x),
      y.max(c.y),
      z.max(c.y),
    ));

  let max = Cube { x: x+1, y: y + 1, z: z + 1 };

  let mut wall_1 = SteamWall {
    t: Min,
    min: min.clone(),
    max: max.clone(),
    live: HashSet::from([min.clone()]),
    blocked: HashMap::new(),
    seen: HashSet::new(),

  };
  println!("min: {:?}; max: {:?}", min, max);
  while !wall_1.live.is_empty() {
    wall_1.step(&lava);  
  }

  let mut wall_2 = SteamWall {
    t: Max,
    min: min.clone(),
    max: max.clone(),
    live: HashSet::from([max.clone()]),
    blocked: HashMap::new(),
    seen: HashSet::new(),

  };

  while !wall_2.live.is_empty() {
    wall_2.step(&lava);  
  }

  let blocked = wall_1.blocked.iter()
    .chain(wall_2.blocked.iter())
    .collect::<HashMap<_,_>>()
    .values()
    .map(|v| v.clone())
    .sum::<usize>();
  println!("{}", blocked); // Off By One in both test and actual -- Not sure why

}