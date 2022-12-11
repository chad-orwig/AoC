
use std::collections::HashSet;

use lib::inputs::d9::PRIMARY;

fn print_rope(rope: &[(i32,i32)]) -> () {
  let mut rows = [['.';41]; 41];
  rows[20][20] = 's';
  let range = 0..41;
  rope.iter()
    .enumerate()
    .rev()
    .for_each(|(i, (x,y))| {
      if !range.contains(x) || !range.contains(y) {return;}
      let row = 20 - y;
      let col = 20 - x;
      rows[row as usize][col as usize] = char::from_digit(i as u32, 10).unwrap();
    
    });
  rows.iter()
    .map(|arr| arr.iter().collect::<String>())
    .for_each(|s| println!("{}",s));
}

fn main() {
  let left = |(x, y): &(i32, i32)| (x - 1, y.to_owned());
  let right = |(x, y): &(i32, i32)| (x + 1, y.to_owned());
  let up = |(x, y): &(i32, i32)| (x.to_owned(), y - 1);
  let down = |(x, y): &(i32, i32)| (x.to_owned(), y + 1);

  let chase = |k1: &(i32, i32), k2: &(i32, i32)| {
    let diff = (k1.0 - k2.0, k1.1 - k2.1);
    return match diff {
      (x,y) if x.abs() != 2 && y.abs() != 2 => k2.to_owned(),
      (2,0) => right(k2),
      (-2,0) => left(k2),
      (0,2) => down(k2),
      (0,-2) => up(k2),

      (x, y) if x > 0 && y > 0 => right(&down(k2)),
      (x, y) if x < 0 && y > 0 => left(&down(k2)),
      (x,y) if x > 0 && y < 0 => right(&up(k2)),
      (x,y) if x < 0 && y < 0 => left(&up(k2)),

      _ => panic!("Unexpected Chase Diff: {:?}", diff),
    }
  };

  let mut rope = [(0, 0); 10];
  let mut k1_seen = HashSet::<(i32,i32)>::new();
  let mut k9_seen = HashSet::<(i32,i32)>::new();

  PRIMARY.split("\n")
  .map(|line| {
    let mut words = line.split_ascii_whitespace();

    let direction = words.next().unwrap();
    let amount = words.next()
      .map(str::parse::<u16>)
      .and_then(Result::ok)
      .unwrap();

    (direction, amount)
  })
  .for_each(|(direction, amount)| {
    let travel_fn = match direction {
        "L" => left,
        "R" => right,
        "U" => up,
        "D" => down,
        _ => panic!("Unknown direction: {}", direction),
    };
    for _ in 0..amount {
      let mut last = (0,0);
      let new_rope: [(i32, i32); 10] = rope.iter()
      .enumerate()
      .map(|(i, knot)| {
        if i == 0 {
          let new_head = travel_fn(knot);
          last = new_head.to_owned();
          return new_head;
        }

        let new_knot = chase(&last, knot);
        last = new_knot.to_owned();
        return new_knot;
      })
      .collect::<Vec<_>>()
      .try_into()
      .unwrap();

      k1_seen.insert(new_rope[1].to_owned());
      k9_seen.insert(new_rope[9].to_owned());
      rope = new_rope;
      
    }
  });

  println!("{}", k1_seen.len());
  println!("{}", k9_seen.len());

}