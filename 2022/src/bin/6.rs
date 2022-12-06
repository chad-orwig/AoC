use std::collections::{VecDeque, HashSet};

use lib::inputs::d6::PRIMARY;

fn all_the_same (dq:&VecDeque<char>, size:usize) -> bool{
  return dq.iter().collect::<HashSet<_>>().len() == size;
}

fn do_the_thing(input: &str, size:usize) -> Option<usize> {
  let mut last_x: VecDeque<char> = VecDeque::with_capacity(size);

  return input.char_indices().fold(Option::None::<usize>, |v, (i, c)| match v {
      Some::<usize>(_) => v,
      _ => {
        if last_x.len() == size { last_x.pop_front(); }
        last_x.push_back(c);
        return if all_the_same(&last_x, size) {Some(i + 1)} else { None::<usize> }
      }
  });
}
fn main() {

  let p1 = do_the_thing(PRIMARY, 4);
  println!("{:?}", p1.unwrap());

  let p2 = do_the_thing(PRIMARY, 14);
  println!("{:?}", p2.unwrap());
}