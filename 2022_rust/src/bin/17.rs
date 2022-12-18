use std::{collections::{BTreeSet, HashSet, VecDeque}, cmp::max};

use lib::inputs::d17::*;

struct Rock {
  name: String,
  h: i64,
  w: i64,
  offsets: BTreeSet<(i64, i64)>,
}

impl Rock {
  fn points<'a>(&'a self, loc: &'a (i64, i64)) -> impl Iterator<Item=(i64, i64)> + 'a {
    self.offsets.iter()
      .map(|(x,y)| (x + loc.0, y + loc.1))
  }
  fn collides_with(&self, my_loc: &(i64, i64), them: &Rock, their_loc: &(i64, i64)) -> bool {
    let uniq_points = self.points(my_loc)
      .chain(them.points(their_loc))
      .collect::<HashSet<_>>();

    uniq_points.len() != self.offsets.len() + them.offsets.len()

  }
  fn collide(&self, loc: &(i64, i64), other_rocks: &VecDeque<((i64,i64), &Rock)>) -> bool {
    other_rocks.into_iter()
      .find(|(their_loc, rock)| self.collides_with(&loc, rock, their_loc))
      .is_some()
  }
}

fn calc_num_blocks( cycles: usize) -> usize {
  1756 * cycles - cycles + 1
}

fn calc_height(cycles: usize) -> usize {
  2722 * cycles + 25 * cycles - 25
}
fn main() {
  let plus = Rock {
    name: String::from("plus"),
    h: 3,
    w: 3,
    offsets: BTreeSet::from([
     (1,0),
     (0,-1),
     (1,-1),
     (2,-1),
     (1,-2), 
    ]),
  };
  let hori = Rock {
    name: String::from("hori"),
    h: 1,
    w: 4,
    offsets: BTreeSet::from([
      (0,0),
      (1,0),
      (2,0),
      (3,0),
    ])
  };
  let l = Rock {
    name: String::from("l"),
    h: 3,
    w: 3,
    offsets: BTreeSet::from([
      (2,0),
      (2,-1),
      (0,-2),
      (1,-2),
      (2,-2),
    ])
  };

  let vert = Rock {
    name: String::from("vert"),
    h: 4,
    w: 1,
    offsets: BTreeSet::from([
      (0,0),
      (0,-1),
      (0,-2),
      (0,-3),
    ])
  };

  let square = Rock {
    name: String::from("square"),
    h: 2,
    w: 2,
    offsets: BTreeSet::from([
      (0,0),
      (1,0),
      (0,-1),
      (1,-1),
    ])
  };

  let order = [&hori, &plus, &l, &vert, &square];

  let chamber_width = 7;

  let mut height = 0i64;
  let mut last = 0;
  
  let mut rocks = VecDeque::<((i64, i64), &Rock)>::with_capacity(30);

  let check_collisions = |loc: &(i64, i64), rock: &Rock, rocks: &VecDeque<_>, height: i64| {
    if loc.1 - rock.h > height {return false;}
    rock.collide(loc, rocks)
  };
  let mut jet_i = 0;
  let left = '<' as u8;
  let right = '>' as u8;

  for i in 0..1000 {
    let rock = order[i % 5];
    let mut loc = (2, height + 3 + rock.h);

    let mut fin = false;

    while !fin {
      // println!("{:?}", loc);
      let jet = TEST.as_bytes()[jet_i % TEST.len()];
      jet_i += 1;
      let new_point = match jet {
        x if x == right => (loc.0 + 1, loc.1),
        x if x == left => (loc.0 - 1, loc.1),
        _ => panic!("RIP"),
      };

      if 
        new_point.0 >= 0 
        && new_point.0 + rock.w <= chamber_width
        && !check_collisions(&new_point, rock, &rocks, height) {
          loc = new_point;
        }
      let new_point = (loc.0, loc.1 - 1);

      if new_point.1 - rock.h >= 0
        && !check_collisions(&new_point, rock, &rocks, height) {
          loc = new_point;
      }
      else {
        fin = true;
        height = max(height, loc.1);
        rocks.push_back((loc, rock));
        if rocks.len() == 30 {
          rocks.pop_front();
        }
        if (i + 1) % 1000 == 0 { 
          println!("{} {} {}", height, rock.name, height - last);
          last = height.clone();
        }
      }
    }
  }

  println!("{}", height);


  // 1514,
  // 1514,
  // 1513,
  // 1516,
  // 1511,
  // 1519,
  // 1513,
  
  println!("{}", vec![1514,
    1514,
    1513,
    1516,
    1511,
    1519,
    1513,].iter().sum::<u64>()); // 10600

  println!("{}", (1000000000000usize - 1000) / 7000); // 142857142
  println!("{}", (1000000000000usize - 1000) % 7000); // 5000

  // 1520 + (142857142 * 10600) + 1514 + 1514 + 1513 + 1516 + 1511
  println!("{}", 1520usize + (142857142 * 10600) + 1514 + 1514 + 1513 + 1516 + 1511);

}