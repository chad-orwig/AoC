use std::collections::{HashMap, HashSet};

use fraction::ToPrimitive;
use lib::{inputs::d22::*, grid::{Grid, Point, GridSlice}};
use num_derive::{FromPrimitive, ToPrimitive};


#[derive(Debug, FromPrimitive, ToPrimitive, Clone)]
enum Facing {
  Right = 0,
  Down = 1,
  Left = 2,
  Up = 3,
}

enum Space {
  Solid,
  Open,  
}

impl From<&char> for Space {
  fn from(value: &char) -> Self {
    match value {
      '.' => Space::Open,
      '#' => Space::Solid,
      _ => panic!("Unknown space {}", value),
    }
  }
}

impl Space {
  fn is_open(&self) -> bool { matches!(self, Space::Open)}
  fn is_solid(&self) -> bool { matches!(self, Space::Solid)}
}

fn get_input() -> (&'static str, &'static str) {
  PRIMARY.split_once("\n\n").unwrap()
}

struct Instructions {
  ins: &'static str,
}

enum Turn {
  Left,
  Right,
}

impl Iterator for Instructions {
  type Item = (i64, Option<Turn>);

  fn next(&mut self) -> Option<Self::Item> {
    if self.ins.is_empty() { return None }
    let i = self.ins.find(|c| c == 'R' || c == 'L');
    if i.is_none() {
      let num = self.ins.parse().unwrap();
      self.ins = "";
      return Some((num, None));
    }
    let (num_str, rest) = self.ins.split_at(i.unwrap());

    let num: i64 = num_str.parse().expect("num_str was not a number");
    let (dir_char, ins) = rest.split_at(1);
    let turn = match dir_char {
      "L" => Turn::Left,
      "R" => Turn::Right,
      _ => panic!("turn was {}", dir_char)
    };
    self.ins = ins;
    Some((num, Some(turn)))
  }
}

fn turn(dir: &Facing, t: &Turn) -> Facing {
  match (dir, t) {
    (Facing::Right, Turn::Left) => Facing::Up,
    (Facing::Right, Turn::Right) => Facing::Down,
    (Facing::Down, Turn::Left) => Facing::Right,
    (Facing::Down, Turn::Right) => Facing::Left,
    (Facing::Left, Turn::Left) => Facing::Down,
    (Facing::Left, Turn::Right) => Facing::Up,
    (Facing::Up, Turn::Left) => Facing::Left,
    (Facing::Up, Turn::Right) => Facing::Right,
  }
}

fn next_point2<F>(num: &i64, loc: &Point<i64>, f: &Facing, rows: &GridSlice<i64, Space>, cols: &GridSlice<i64, Space>, grid: &Grid<i64, Space>, wrap: F) -> (Point<i64>, Facing)
where F: Fn(&(Point<i64>, Facing)) -> (Point<i64>, Facing) {
  let mut cur = (loc.clone(), f.clone());
  let mut next;

  let get_next = |(loc, dir): &(Point<i64>, Facing)| {
    match dir {
      Facing::Right => Point { x: loc.x + 1, y: loc.y },
      Facing::Down => Point { x: loc.x, y: loc.y + 1 },
      Facing::Left => Point { x: loc.x - 1, y: loc.y },
      Facing::Up => Point { x: loc.x, y: loc.y - 1 },
    }
  };

  let mut steps = 0;
  while &steps < num {
    let next_loc = get_next(&cur);
    next = match grid.grid.get(&next_loc) {
      Some(_) => (next_loc, cur.1.clone()),
      None => wrap(&cur),
    };
    match grid.grid.get(&next.0) {
      Some(Space::Open) => {
        steps += 1;
        cur = next;
      },
      Some(Space::Solid) => { return cur; },
      None => panic!("Shouldn't be possible"),
    }
  }
  cur
}

fn next_point(num: &i64, loc: &Point<i64>, dir: &Facing, rows: &GridSlice<i64, Space>, cols: &GridSlice<i64, Space>, grid: &Grid<i64, Space>) -> Point<i64> {
  let mut cur = loc.clone();
  let mut next;

  let get_next = |loc: &Point<i64>| {
    match dir {
      Facing::Right => Point { x: loc.x + 1, y: loc.y },
      Facing::Down => Point { x: loc.x, y: loc.y + 1 },
      Facing::Left => Point { x: loc.x - 1, y: loc.y },
      Facing::Up => Point { x: loc.x, y: loc.y - 1 },
    }
  };

  let reset = || {
    match dir {
      Facing::Right => Point { x: rows.mins[&loc.y], y: loc.y },
      Facing::Down => Point { x: loc.x, y: cols.mins[&loc.x] },
      Facing::Left => Point { x: rows.maxes[&loc.y], y: loc.y },
      Facing::Up => Point { x: loc.x, y: cols.maxes[&loc.x] },
    }
  };

  let mut steps = 0;
  while &steps < num {
    next = get_next(&cur);
    next = match grid.grid.get(&next) {
      Some(_) => next,
      None => reset(),
    };
    match grid.grid.get(&next) {
      Some(Space::Open) => {
        steps += 1;
        cur = next;
      },
      Some(Space::Solid) => { return cur; },
      None => panic!("Shouldn't be possible"),
    }
  }
  cur
}

enum Section {
    One,
    Two,
    Three,
    Four,
    Five,
    Six,
}

fn main() {
  let (map, ins) = get_input();

  let grid: Grid<_,_> = map.split('\n')
    .enumerate()
    .flat_map(|(row, line)| {
      let y = row as i64 + 1;
      line.char_indices()
        .filter(|(i, c)| c == &'.' || c == &'#')
        .map(move |(col, c)| {
          let x = col as i64 + 1;
          (x, y, Space::from(&c))
        })
    })
    .collect();

  let rows = GridSlice::row_slice(&grid);
  let cols = GridSlice::col_slice(&grid);

  let x_start = rows.mins[&1];
  let mut loc = Point { x: x_start, y: 1 };
  let mut dir = Facing::Right;

  let instructions = Instructions { ins };

  instructions.for_each(|(num, t)| {
    loc = next_point(&num, &loc, &dir, &rows, &cols, &grid);
    if t.is_some() {
      dir = turn(&dir, &t.unwrap());
    }
  });

  let p1 = (1000 * loc.y) + (4 * loc.x) + ToPrimitive::to_i64(&dir).unwrap();

  println!("{}",p1);

  let mut row_widths = rows.slice.iter()
    .map(|(y,m)| (y,m.len()))
    .collect::<Vec<_>>();

  row_widths.sort_by_key(|i| i.0);

  let row_splits:[(i64, usize); 4] = row_widths.into_iter()
    .fold(Vec::new(), |mut v, (y, h)| {
      let last = v.last();

      match last {
        None => v.push((y.clone(), h)),
        Some(l) if l.1 != h => v.push((y.clone(), h)),
        _ => (),
      }

      v
    })
    .try_into()
    .unwrap();

  let mut col_heights = cols.slice.iter()
    .map(|(x, m)|(x, m.len()))
    .collect::<Vec<_>>();

  col_heights.sort_by_key(|i| i.0);


  
  let col_splits: [(i64, usize); 3] = col_heights.into_iter()
    .fold(Vec::new(), |mut v, (x, h)| {
      let last = v.last();

      match last {
        None => v.push((x.clone(), h)),
        Some(l) if l.1 != h => v.push((x.clone(), h)),
        _ => (),
      }

      v
    })
    .try_into()
    .unwrap();

  

  let section = |p: &Point<i64>| {

    match (p.x, p.y) {
      (51..=100, 1..=50) => Section::One,
      (101..=150, 1..=50) => Section::Two,
      (51..=100, 51..=100) => Section::Three,
      (1..=50, 101..=150) => Section::Four,
      (51..=100, 101..=150) => Section::Five,
      (1..=50, 151..=200) => Section::Six,

      _ => panic!("Impossilble {:?}", p)
    }

  };

  let wrap = |(p, dir): &(Point<i64>, Facing)| {
    let section = section(p);
    match (section, dir) {
      (Section::One, Facing::Left) => {
        let y = row_splits[3].0 - p.y;
        (Point { x: 1, y }, Facing::Right)
      },
      (Section::One, Facing::Up) => {
        let y = p.x + 100;
        (Point { x: 1, y}, Facing::Right)
      },
      (Section::Two, Facing::Right) => {
        let y = row_splits[3].0 - p.y;
        (Point { x: 100, y}, Facing::Left)
      },
      (Section::Two, Facing::Down) => {
        let y = p.x - 50;
        (Point { x: 100, y}, Facing::Left)
      },
      (Section::Two, Facing::Up) => {
        let x = p.x - 100;
        (Point { x, y: 200}, Facing::Up)
      },
      (Section::Three, Facing::Right) => {
        let x = p.y + 50;
        (Point { x, y: 50}, Facing::Up)
      },
      (Section::Three, Facing::Left) => {
        let x = p.y - 50;
        (Point { x, y: 101}, Facing::Down)
      },
      (Section::Four, Facing::Left) => {
        let y = row_splits[3].0 - p.y;
        (Point { x: 51, y }, Facing::Right)
      },
      (Section::Four, Facing::Up) => {
        let y = p.x + 50;
        (Point { x: 51, y}, Facing::Right)
      },
      (Section::Five, Facing::Right) => {
        let y = row_splits[3].0 - p.y;
        (Point { x: 150, y}, Facing::Left)
      },
      (Section::Five, Facing::Down) => {
        let y = p.x + 100;
        (Point { x: 50, y}, Facing::Left)
      },
      (Section::Six, Facing::Right) => {
        let x = p.y - 100;
        (Point { x, y: 150}, Facing::Up)
      },
      (Section::Six, Facing::Down) => {
        let x = p.x + 100;
        (Point { x, y: 1}, Facing::Down)
      },
      (Section::Six, Facing::Left) => {
        let x = p.y - 100;
        (Point { x, y: 1}, Facing::Down)
      },

      _ => panic!("Impossible"),
    }
  };

  let mut loc = Point { x: x_start, y: 1 };
  let mut dir = Facing::Right;

  let instructions = Instructions { ins };

  instructions.for_each(|(num, t)| {
    (loc, dir) = next_point2(&num, &loc, &dir, &rows, &cols, &grid, wrap);
    if t.is_some() {
      dir = turn(&dir, &t.unwrap());
    }
  });
  println!("{:?}", col_splits);

  let p2 = (1000 * loc.y) + (4 * loc.x) + ToPrimitive::to_i64(&dir).unwrap();

  println!("{}",p2);

}

