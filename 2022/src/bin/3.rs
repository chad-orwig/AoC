use std::collections::HashMap;

use lib::inputs::d3::primary;
#[derive(Debug)]
struct Rucksack {
  left: HashMap<char, u64>,
  right: HashMap<char, u64>
}

fn count_chars(mut map:HashMap<char, u64>, c: char) -> HashMap<char, u64>{
  let current = map.get(&c).unwrap_or(&0u64);
  map.insert(c, current + 1);
  return map;
}

impl Rucksack {
    pub fn new (in_str: &str) -> Self {
      let chunk_size = in_str.len()/2;
      let (left_str, right_str) = in_str.split_at(chunk_size);
      let left: HashMap<char, u64> = left_str.chars().fold(HashMap::new(), count_chars);
      let right: HashMap<char, u64> = right_str.chars().fold(HashMap::new(), count_chars);
      Self {
        left,
        right,
      }
    }
    
    pub fn find_dup (self:&Self) -> Option<&char> {
      return self.left.keys()
        .filter(|k| self.right.contains_key(k))
        .next();
    }

    pub fn has_item(self: &Self, item: &char) -> bool {
      return self.left.contains_key(item) || self.right.contains_key(item);
    }

    pub fn items(self: &Self) -> impl Iterator<Item = &char>{
      let result = self.left.keys().chain(self.right.keys());
      return result;
    }
}

fn get_input() -> Vec<Rucksack> {
  return primary.split("\n")
    .map(Rucksack::new)
    .collect();
}

fn item_priority(c:&char) -> u32 {
  return match c {
    x if x.is_lowercase() => (x.to_owned() as u32) - 96,
    x if x.is_uppercase() => (x.to_owned() as u32) - 38,
    _ => panic!("character is not a letter")
  };
}

fn shared_char(elves: &[Rucksack]) -> &char {
  let first = &elves[0];
  let rest = &elves[1..];

  let result = first.items()
    .filter(|i| rest.iter().all(|e| e.has_item(i)))
    .next().unwrap();

  return result;
}

fn main() {
  let input = get_input();

  let p1 = input.iter()
    .map(Rucksack::find_dup)
    .map(Option::unwrap)
    .map(item_priority)
    .sum::<u32>();

  let p2 = input.chunks(3)
    .map(shared_char)
    .map(item_priority)
    .sum::<u32>();

  println!("{:?}", p1);
  println!("{:?}", p2);
}