use std::collections::VecDeque;

use lib::inputs::d5::PRIMARY;
use once_cell::sync::Lazy;
use regex::Regex;

#[derive(Debug)]
struct Instruction {
  count: u16,
  source: u8,
  dest: u8,
}

impl Instruction {
  pub fn new(line:&str) -> Self {
    static line_matcher: Lazy<Regex> = Lazy::new(||Regex::new(r"^move (\d+) from (\d+) to (\d+)$").unwrap());

    let nums = line_matcher.captures_iter(line).next().unwrap();
    Self {
      count: nums[1].parse().unwrap(),
      source: nums[2].parse::<u8>().unwrap() - 1u8,
      dest: nums[3].parse::<u8>().unwrap() - 1u8,
    }
  }
}

fn get_input() -> ([VecDeque<char>; 9], Vec<Instruction>) {
  let split = PRIMARY.split("\n\n").collect::<Vec<_>>();

  let instructions = split[1].split("\n").map(Instruction::new).collect::<Vec<_>>();

  let state:[VecDeque<char>; 9] = [
    VecDeque::from(['W','R','T','G']),
    VecDeque::from(['W','V','S','M','P','H','C','G']),
    VecDeque::from(['M','G','S','T','L','C']),
    VecDeque::from(['F','R','W','M','D','H','J']),
    VecDeque::from(['J','F','W','S','H','L','Q','P']),
    VecDeque::from(['S','M','F','N','D','J','P']),
    VecDeque::from(['J','S','C','G','F','D','B','Z']),
    VecDeque::from(['B','T','R']),
    VecDeque::from(['C','L','W','N','H']),
  ];

  return (state, instructions);
}

fn main() {
  let (mut state, instructions) = get_input();

  for Instruction { count, source, dest} in instructions {
    for _ in 0..count {
      let c = state[source as usize].pop_front().unwrap();
      state[dest as usize].push_front(c);
    }
  }

  let p1 = state.iter()
    .map(VecDeque::front)
    .map(Option::unwrap)
    .collect::<String>();
  println!("{:?}", p1);

  let (mut state2, instructions2) = get_input();

  for Instruction { count, source, dest } in instructions2 {
    let mut arr: Vec<char> = Vec::with_capacity(count as usize);

    for _ in 0..count {
      arr.push(state2[source as usize].pop_front().unwrap());
    }

    arr.reverse();

    arr.into_iter()
      .for_each(|c| state2[dest as usize].push_front(c));
  }

    
  let p2 = state2.iter()
    .map(VecDeque::front)
    .map(Option::unwrap)
    .collect::<String>();
  println!("{:?}", p2);
}