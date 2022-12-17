use std::{collections::{BTreeSet, HashSet}, cmp::max};

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
  fn collide(&self, loc: &(i64, i64), other_rocks: &Vec<((i64,i64), &Rock)>) -> bool {
    other_rocks.into_iter()
      .find(|(their_loc, rock)| self.collides_with(&loc, rock, their_loc))
      .is_some()
  }
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
  
  let mut rocks = Vec::<((i64, i64), &Rock)>::with_capacity(2022);

  let mut jet_i = 0;
  let left = '<' as u8;
  let right = '>' as u8;

  for i in 0..2022 {
    let rock = order[i % 5];
    let mut loc = (2, height + 3 + rock.h);

    let mut fin = false;

    while !fin {
      // println!("{:?}", loc);
      let jet = PRIMARY.as_bytes()[jet_i % PRIMARY.len()];
      jet_i += 1;
      let new_point = match jet {
        x if x == right => (loc.0 + 1, loc.1),
        x if x == left => (loc.0 - 1, loc.1),
        _ => panic!("RIP"),
      };

      if 
        new_point.0 >= 0 
        && new_point.0 + rock.w <= chamber_width
        && !rock.collide(&new_point, &rocks) {
          loc = new_point;
        }
      let new_point = (loc.0, loc.1 - 1);

      if new_point.1 - rock.h >= 0
        && !rock.collide(&new_point, &rocks) {
          loc = new_point;
      }
      else {
        // println!("{:?}: {}", loc, rock.name);
        fin = true;
        height = max(height, loc.1);
        rocks.push((loc, rock));
      }
    }
  }

  println!("{}", height);

}