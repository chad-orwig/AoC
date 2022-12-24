use std::cmp::Reverse;
use std::collections::BTreeMap;
use std::ops::Add;

use crate::Space::*;
use crate::Direction::*;
use either::Either;
use fraction::FromPrimitive;
use fraction::Integer;
use lib::grid::build_bounding_box;
use lib::search::Searchable;
use lib::search::search;
use lib::{inputs::d24::*, grid::Point};
use num_derive::FromPrimitive;

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, FromPrimitive, Clone, Hash)]
enum Direction {
  Up = 0,
  Down = 1,
  Left = 2,
  Right = 3,
}

impl Into<char> for &Direction {
  fn into(self) -> char {
    match self {
        Up => '^',
        Down => 'v',
        Left => '<',
        Right => '>',
    }
  }
}

impl Into<Point<i64>> for &Direction {
  fn into(self) -> Point<i64> {
    match self {
      Up => Point { x: 0, y: -1 },
      Down => Point { x: 0, y: 1 },
      Left => Point { x: -1, y: 0 },
      Right => Point { x: 1, y: 0 },
    }
  }
}

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Default, Clone)]
struct BlizCount {
  up: bool,
  down: bool,
  left: bool,
  right: bool,
}

impl BlizCount {
  fn iter(&self) -> impl Iterator<Item = Direction> {
    [self.up, self.down, self.left, self.right].into_iter()
      .enumerate()
      .filter(|(_,b)| *b)
      .map(|(i,_)| FromPrimitive::from_usize(i).unwrap())

  }
}

impl Into<char> for &BlizCount {
  fn into(self) -> char {
    let dirs = self.iter().collect::<Vec<_>>();
    let count = dirs.len();
    match count {
      0 => 'X',
      1 => (&dirs[0]).into(),
      2|3|4 => (count as u8 + '0' as u8) as char,
      _ => panic!("wtf")
    }
  }
}

impl Add<&BlizCount> for BlizCount {
    type Output = BlizCount;

    fn add(self, rhs: &BlizCount) -> Self::Output {
      BlizCount {
        up: self.up || rhs.up,
        down: self.down || rhs.down,
        left: self.left || rhs.left,
        right: self.right || rhs.right,
      }
    }
}

impl From<&Direction> for BlizCount {
  fn from(value: &Direction) -> Self {
    match value {
      Up => BlizCount { up: true, down: false, left: false, right: false },
      Down => BlizCount { up: false, down: true, left: false, right: false },
      Left => BlizCount { up: false, down: false, left: true, right: false },
      Right => BlizCount { up: false, down: false, left: false, right: true },
    }
  }
}
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Clone)]
enum Space {
  Wall,
  Blizzard(BlizCount),
}

impl Default for Space {
  fn default() -> Self {
    Blizzard(BlizCount::default())
  }
}

impl Space {
  fn get_bliz_count(&self) -> &BlizCount {
    match self {
      Wall => panic!("this is a wall"),
      Blizzard(bc) => bc,
    }
  }
}

impl Into<char> for &Space {
  fn into(self) -> char {
    match self {
      Wall => '#',
      Blizzard(bc) => bc.into(),
    }
  }
}

#[derive(PartialEq, Eq, PartialOrd, Ord, Hash, Debug)]
struct State {
  loc: Point<i64>,
  dest:Point<i64>,
  minute: usize,
}

impl Searchable<(Point<i64>,usize),  Reverse<usize>> for State {
  fn key(&self) ->(Point<i64>, usize) {
    (self.loc.clone(), self.minute)
  }

  fn priority(&self) -> Reverse<usize> {
    let distance = (self.loc.x - self.dest.x).abs() as usize
    + (self.loc.y - self.dest.y).abs() as usize;
    
    let best_finish = self.minute + distance;

    Reverse(best_finish)
  }

  fn finished(&self) -> bool {
      self.loc == self.dest
  }
}

fn get_next(grid: &BTreeMap<Point<i64>, Space>, maxes: &(i64, i64)) -> BTreeMap<Point<i64>, Space> {
  grid.iter()
    .map(|(p, s)| {
      match s {
        Wall => vec![(p.clone(), Either::Left(Wall))],
        Blizzard(bc) => bc.iter()
          .map(|d|((p + &(&d).into()), d))
          .map(|(p, d)| (p, Either::Right(d)))
          .collect(),
      }
    })
    .flat_map(Vec::into_iter)
    .map(|(p, e)| {
      match e {
      Either::Left(w) => (p,w),
      Either::Right(d) => {
        match grid.get(&p) {
          Some(Wall) => match d {
            Up => (Point { x: p.x, y: maxes.1 - 1 }, Blizzard(BlizCount::from(&d))),
            Down => (Point { x: p.x, y: 1 }, Blizzard(BlizCount::from(&d))),
            Left => (Point { x: maxes.0 - 1, y: p.y }, Blizzard(BlizCount::from(&d))),
            Right => (Point { x: 1, y: p.y }, Blizzard(BlizCount::from(&d))),
          },
          _ => (p, Blizzard(BlizCount::from(&d)))
        }
      },
    }
    })
    .fold(BTreeMap::new(), |mut m, (p, s)| {
      match s {
      Wall => {m.insert(p, s);},
      Blizzard(bc) => {
        let cur = m.entry(p).or_default();
        *cur = Blizzard(bc + cur.get_bliz_count());
      },
    };
      m
    })
}


fn main() {
  let input = PRIMARY;
  let initial_grid = input.split("\n")
    .enumerate()
    .flat_map(|(y,line)| line.char_indices()
      .map(move |(x, c)| (x,y,c)))
    .filter(|(_,_,c)| c != &'.')
    .map(|(x,y,c)| {
      let s = match c {
        '#' => Wall,
        '^' => Blizzard(BlizCount::from(&Up)),
        'v' => Blizzard(BlizCount::from(&Down)),
        '<' => Blizzard(BlizCount::from(&Left)),
        '>' => Blizzard(BlizCount::from(&Right)),
        _ => panic!("wut {}",c),
      };
      (Point{ x: x as i64,y: y as i64},s)
    })
    .collect::<BTreeMap<_,_>>();

  let start = Point { x: 1, y: 0 };
  let (x_bounds, y_bounds) = build_bounding_box(initial_grid.iter());
  let maxes = (x_bounds.1.clone(), y_bounds.1.clone());
  let dest = Point { x: maxes.0 -1, y: maxes.1};

  let cycle = (maxes.0 - 1).lcm(&(maxes.1 - 1)) as usize;

  let mut grids = Vec::new();
  grids.push(initial_grid);

  for i in 1..cycle {
    let next = get_next(&grids[i - 1], &maxes);
    grids.push(next);
  }

  let next_state = | State { loc, minute, dest }: &State | {
    let minute = minute + 1;
    let grid = &grids[minute % grids.len()];
    [None, Some(Up), Some(Down), Some(Left), Some(Right)]
      .into_iter()
      .map(|o| match o {
        None => (o, Point { x: 0, y: 0}),
        Some(d) => {
          let p = (&d).into();
          (Some(d), p)
        },
      })
      .map(|(o,p)| (o,loc + &p))
      .map(|(o,p)| {
        let cur = grid.get(&p);
        (o,p,cur)
      })
      .filter(|(_,p,_)| (0..=maxes.0).contains(&p.x) && (0..=maxes.1).contains(&p.y))
      .filter(|(_,_, s)| matches!(s, None))
      .map(|(_, loc, _)| {
        State { loc, minute, dest: dest.clone() }
      })
      .collect::<Vec<_>>()
  };

  let p1 = search(vec![State {
    loc: start.clone(),
    dest: dest.clone(),
    minute: 0,
    
  }], next_state, None).unwrap();

  println!("{:?}", p1.minute);

  let back_to_start = search(vec![State {
    loc: p1.loc,
    dest: start.clone(),
    minute: p1.minute,
    
  }], next_state, None).unwrap();

  let p2 = search(vec![State {
    loc: back_to_start.loc,
    dest: dest.clone(),
    minute: back_to_start.minute,
    
  }], next_state, None).unwrap();

  println!("{}", p2.minute);
}