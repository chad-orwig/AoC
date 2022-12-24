use std::{sync::atomic::AtomicUsize, collections::HashMap, ops::Add};

use lib::{inputs::d23::*, grid::{Grid, Point, build_bounding_box, print_grid}};
use std::sync::atomic::Ordering::*;

static DIRECTION_INDEX: AtomicUsize = AtomicUsize::new(0);
const DIRECTIONS_TO_CONSIDER: [Direction; 4] = [Direction::North, Direction::South, Direction::West, Direction::East];
#[derive(Debug)]
enum Direction {
  North,
  South,
  West,
  East,
}
struct Elf;

impl Into<char> for &Elf {
  fn into(self) -> char {
    '#'
  }
}

impl Elf {
  fn consider_direction(loc: &Point<i64>, grove: &Grid<i64, Elf>) -> Option<&'static Direction>{
    let nearby: [bool; 8] = [
      (-1, -1), (0, -1), (1, -1),
      (-1, 0), (1, 0),
      (-1, 1), (0, 1), (1, 1),
    ].into_iter()
    .map(Point::from_tuple)
    .map(|p| &p + loc)
    .map(|p| grove.grid.contains_key(&p))
    .collect::<Vec<_>>()
    .try_into()
    .unwrap();

    if nearby.iter().all(|b| !b) { return None; }

    (DIRECTION_INDEX.load(Acquire)..4)
    .chain(0..DIRECTION_INDEX.load(Acquire))
    .map(|i| &DIRECTIONS_TO_CONSIDER[i])
    .filter(|d| {
       match d {
        Direction::North => nearby[0..3].iter().all(|b| !b),
        Direction::South => nearby[5..].iter().all(|b| !b),
        Direction::West => [&nearby[0], &nearby[3], &nearby[5]].into_iter().all(|b| !b),
        Direction::East => [&nearby[2], &nearby[4], &nearby[7]].into_iter().all(|b| !b),
      }
    })
    .next()
  }
}

impl Into<Point<i64>> for &Direction {
    fn into(self) -> Point<i64> {
      match self {
        Direction::North => Point { x: 0, y: -1 },
        Direction::South => Point { x: 0, y: 1 },
        Direction::West => Point { x: -1, y: 0 },
        Direction::East => Point { x: 1, y: 0 },
      }
    }
}

impl Add<&Direction> for &Point<i64> {
    type Output = Point<i64>;

    fn add(self, rhs: &Direction) -> Self::Output {
      let p: Point<i64> = rhs.into();
      self + &p
    }
}

fn get_input() -> Grid<i64, Elf> {

  PRIMARY.split("\n")
    .enumerate()
    .flat_map(|(y, line) | line.char_indices()
      .filter(|(_, c)| c == &'#')
      .map(move |(x, _)| (x as i64, y as i64))
    )
    .enumerate()
    .map(|(i, (x, y))| (x, y, Elf {}))
    .collect()
}

fn find_proposals(grove: &Grid<i64, Elf>) -> Vec<(Point<i64>, Point<i64>)> {
  let mut proposals = grove.grid.iter()
    .map(|(p,e)| ((p, e), Elf::consider_direction(p, grove)))
    .collect::<Vec<_>>();
  // proposals.sort_by_key(|((_,e),_)| e.name );
  // proposals.iter().for_each(|((_,e),p)| println!("{:?} -> {:?}", e.name, p));

  let proposals: HashMap<Point<i64>, Vec<&Point<i64>>> = proposals.into_iter()
    .filter(|(_,o)| o.is_some())
    .map(|((p,_),o)| (p, o.unwrap()))
    .map(|(s, d)| (s, s + d))
    .fold(HashMap::new(), |mut m, (s, d)| {
      m.entry(d).or_default().push(s);
      m
    });

  proposals.into_iter()
    .filter(|(_, v)| v.len() == 1)
    .map(|(d, v)| (d, v[0].clone()))
    .collect()
}

fn main () {
  let mut grove = get_input();
  // draw_grid(&grove);
  for _ in 0..10 {
    let props = find_proposals(&grove);
    props.into_iter()
      .for_each(|(d, s)| {
        let e = grove.grid.remove(&s).unwrap();
        grove.grid.insert(d, e);
      });

    let cur_index = DIRECTION_INDEX.load(Acquire);
    let new_index = (cur_index + 1) % 4;
    DIRECTION_INDEX.store(new_index, Release);

    // draw_grid(&grove);
  }

  let (x_bounds, y_bounds) = build_bounding_box(grove.grid.iter());

  let size = ((x_bounds.0 - x_bounds.1).abs() + 1) * ((y_bounds.0 - y_bounds.1).abs() + 1);
  let p1 = size - grove.grid.len() as i64;
  println!("{}", p1);

  let mut round:usize = 11;
  loop {
    let props = find_proposals(&grove);
    if props.is_empty() {
      break;
    }
    else {
      round += 1;
    }
    props.into_iter()
      .for_each(|(d, s)| {
        let e = grove.grid.remove(&s).unwrap();
        grove.grid.insert(d, e);
      });

    let cur_index = DIRECTION_INDEX.load(Acquire);
    let new_index = (cur_index + 1) % 4;
    DIRECTION_INDEX.store(new_index, Release);
  }
  println!("{}", round);
  print_grid(grove.grid.iter(), ' ', &build_bounding_box(grove.grid.iter()));
}