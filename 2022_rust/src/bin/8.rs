use std::collections::HashSet;

use lib::inputs::d8::PRIMARY;


fn main() {

  let tree_heights = PRIMARY.split("\n")
    .map(|line|line.as_bytes().iter()
      .map(|c| (c - '0' as u8) as i16)
      .collect::<Vec<_>>()
    )
    .collect::<Vec<_>>();

  let row_len = tree_heights[0].len();
  let col_len = tree_heights.len();

  let mut seen = HashSet::<(usize,usize)>::new();
  
  for col_i in 0..col_len {
    let mut highest = -1i16;
    for row_i in 0..row_len {
      let height = tree_heights[col_i][row_i];
      if height > highest {
        seen.insert((col_i, row_i));
        highest = height;
      }
    }
  }

  for col_i in 0..col_len {
    let mut highest = -1i16;
    for i in 1..=row_len {
      let row_i = row_len - i;
      let height = tree_heights[col_i][row_i];
      if height > highest {
        seen.insert((col_i, row_i));
        highest = height;
      }
    }
  }

  for row_i in 0..row_len {
    let mut highest = -1i16;
    for col_i in 0..col_len {
      let height = tree_heights[col_i][row_i];
      if height > highest {
        seen.insert((col_i, row_i));
        highest = height;
      }
    }
  }

  for row_i in 0..row_len {
    let mut highest = -1i16;
    for i in 1..=col_len {
      let col_i = col_len - i;
      let height = tree_heights[col_i][row_i];
      if height > highest {
        seen.insert((col_i, row_i));
        highest = height;
      }
    }
  }

  println!("{:?}", seen.len());
  
}