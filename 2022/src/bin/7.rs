use std::{cell::Cell, collections::HashMap};

use lib::inputs::d7::PRIMARY;

#[derive(Debug)]
struct File {
  name: String,
  size: u64,
  parent: usize,
}
#[derive(Debug)]
struct Dir {
  parent: Option<usize>,
  index: usize,
  name: String,
  files: HashMap<String, File>,
  subdirs: HashMap<String, usize>,
  size: Cell<Option<u64>>,
}

impl Dir {
  fn new (index: usize, parent: Option<usize>, name: &str) -> Self {
    Self {
      index,
      parent,
      name: String::from(name),
      files: HashMap::new(),
      subdirs: HashMap::new(),
      size: Cell::new(None)
    }
  }
  fn get_size(self: &Dir, dirs:&Vec<Dir>) -> u64 {
    let size_option = self.size.get();
    match size_option {
      Some(_) => size_option.unwrap(),
      None => {
        let file_size = self.files.iter().map(|(_, f)| f.size).sum::<u64>();
        let subdir_size = self.subdirs.iter().map(|(_, d)| dirs[d.to_owned()].get_size(dirs)).sum::<u64>();
        self.size.set(Some(file_size + subdir_size));
        return file_size + subdir_size;
      } 
    }
  }
}

fn main() {
  let mut dirs: Vec<Dir> = Vec::from([Dir::new(0, None, "/")]);
  let lines: Vec<&str> = PRIMARY.split("\n")
    .collect();
  
  let mut current_dir_index = 0usize;
  let mut dir_len = 1usize;
  for line in lines {
    match line {
      "$ cd /" => current_dir_index = 0,
      "$ ls" => {},
      "$ cd .." => {
        let current_dir = &dirs[current_dir_index];
        current_dir_index = current_dir.parent.unwrap();
      }
      x if x.starts_with("$ cd ") => {
        let current_dir = &mut dirs[current_dir_index];
        let dir_name = String::from(line.strip_prefix("$ cd ").unwrap());
        current_dir_index = current_dir.subdirs.get(&dir_name).unwrap().to_owned();
      }
      x if x.starts_with("dir") => {
        let current_dir = &mut dirs[current_dir_index];
        let name = String::from(x.strip_prefix("dir ").unwrap());
        if !current_dir.subdirs.contains_key(&name) {
          let index = dir_len;
          dir_len = index + 1;
          let new_dir = Dir::new(index, Some(current_dir.index), name.as_str());
          current_dir.subdirs.insert(name, index);
          dirs.push(new_dir);
        }
      }
      _ => {
        let pieces = line.split(" ").collect::<Vec<&str>>();
        let new_file = File {
          name: String::from(pieces[1]),
          size: pieces[0].parse().unwrap(),
          parent: current_dir_index,
        };

        let current_dir = &mut dirs[current_dir_index];
        current_dir.files.insert(String::from(pieces[1]), new_file);
      }
    }
  }

    let p1: u64 = dirs.iter()
      .map(|d|d.get_size(&dirs))
      .filter(|s| s <= &100000u64)
      .sum();

    println!("{:?}", p1);

    let root_size = dirs[0].get_size(&dirs);

    let available_space = 70000000 - root_size;

    let needed_to_free_space = 30000000 - available_space;

    let p2 = dirs.iter()
      .filter(|d| d.get_size(&dirs) >= needed_to_free_space)
      .min_by(|d1,d2| {
        let s1 = d1.get_size(&dirs);
        let s2 = d2.get_size(&dirs);
        s1.cmp(&s2)
      });

      println!("{:?}", p2.unwrap().get_size(&dirs));

}