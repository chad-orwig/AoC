use std::collections::HashSet;

use lib::inputs::d8::PRIMARY;

#[derive(Debug)]
struct Vis {
  left: u16,
  right: u16,
  up: u16,
  down: u16,
}

#[derive(Debug)]
struct Tree {
  height: u8,
  vis: Vis,
}

impl Tree {
  fn new(height: u8) -> Self {
    Tree {
      height,
      vis: Vis { left: 0, right: 0, up: 0, down: 0 },
    } 
  }
}

impl Vis {
  fn calc_score(self: &Vis) -> u64 {
    return self.up as u64 * self.down as u64 * self.left as u64 * self.right as u64;
  }
}

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

  let mut trees = tree_heights.iter()
    .map(|v| v.iter()
      .map(|h| *h as u8)
      .map(Tree::new)
      .collect::<Vec<_>>())
    .collect::<Vec<_>>();

  for y in 0..trees.len() {
    for x in 0..trees[0].len() {
      let tree  = &trees[y][x];
      let left_neighbors = &trees[y][..x];
      let blocking_left_neighbor = left_neighbors.iter()
        .rev()
        .enumerate()
        .filter(|(_, t)| t.height >= tree.height)
        .map(|(i,_)| i)
        .next();
      
      let left = match blocking_left_neighbor {
        Some(i) => i as u16 + 1,
        None => left_neighbors.len() as u16,
      };

      let mutable_tree = &mut trees[y][x];
      mutable_tree.vis.left = left;
    }
  }

  for y in 0..trees.len() {
    for x in 0..trees[0].len() {
      let tree = &trees[y][x];
      let up_neighbors = trees[..y].iter().map(|t| &t[x]).collect::<Vec<_>>();
      let blocking_up_neighbor = up_neighbors.iter()
        .rev()
        .enumerate()
        .filter(|(_, t)| t.height >= tree.height)
        .map(|(i,_)| i)
        .next();
      
      let up = match blocking_up_neighbor {
        Some(i) => i as u16 + 1,
        None => up_neighbors.len() as u16,
      };

      let mutable_tree = &mut trees[y][x];
      mutable_tree.vis.up = up;
    }
  }


  for y in 0..trees.len() {
    for i in 0..trees[0].len() {
      let x = trees.len() -1 - i;
      let tree = &trees[y][x];
      let right_neighbors = trees[y].get(x + 1..).unwrap_or_default();
      let blocking_right_neighbor = right_neighbors.iter()
        .enumerate()
        .filter(|(_, t)| t.height >= tree.height)
        .map(|(i,_)| i)
        .next();
      
      let right = match blocking_right_neighbor {
        Some(i) => i as u16 + 1,
        None => right_neighbors.len() as u16,
      };

      let mutable_tree = &mut trees[y][x];
      mutable_tree.vis.right = right;
    }
  }

  for i in 0..trees.len() {
    for x in 0..trees[0].len() {
      let y = trees.len() - 1 - i;
      let col = trees.iter().map(|t| &t[x]).collect::<Vec<_>>();
      let tree = col[y];
      let down_neighbors = col.get(y + 1..).unwrap_or_default();
      let blocking_down_neighbor = down_neighbors.iter()
        .enumerate()
        .filter(|(_, t)| t.height >= tree.height)
        .map(|(i,_)| i)
        .next();
      
      let down = match blocking_down_neighbor {
        Some(i) => i as u16 + 1,
        None => down_neighbors.len() as u16,
      };

      let mutable_tree = &mut trees[y][x];
      mutable_tree.vis.down = down;
    }
  }

  let p2 = trees.iter()
    .flat_map(|v| v.iter())
    .map(|t| &t.vis)
    .map(Vis::calc_score)
    .max()
    .unwrap();
    

  println!("{:?}", p2);

  // trees.iter()
  //   .for_each(|row| row.iter().for_each(|t|println!("{:?}", t)));
}