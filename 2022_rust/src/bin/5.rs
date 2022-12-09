use std::collections::VecDeque;

use lib::inputs::d5::PRIMARY;
use once_cell::sync::Lazy;
use regex::Regex;

#[derive(Debug)]
struct Instruction {
  count: u8,
  source: u8,
  dest: u8,
}

impl Instruction {
  pub fn new(line:&str) -> Self {
    static LINE_MATCHER: Lazy<Regex> = Lazy::new(||Regex::new(r"^move (\d+) from (\d+) to (\d+)$").unwrap());

    let nums = LINE_MATCHER.captures_iter(line).next().unwrap();
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

  let mut state:[VecDeque<char>; 9] = [
    VecDeque::new(),
    VecDeque::new(),
    VecDeque::new(),
    VecDeque::new(),
    VecDeque::new(),
    VecDeque::new(),
    VecDeque::new(),
    VecDeque::new(),
    VecDeque::new(),
  ];

  let r = Regex::new(r"^(.{3}\s)(.{3}\s)(.{3}\s)(.{3}\s)(.{3}\s)(.{3}\s)(.{3}\s)(.{3}\s)(.{3})$").unwrap();

  split[0].split("\n")
    .map(|line|r.captures(line))
    .filter(Option::is_some)
    .map(Option::unwrap)
    .for_each(|c| {
      for i in 1..10 {
        let c = c[i].chars().nth(1);
        match c {
          Some('A'..='Z') => state[i - 1].push_back(c.unwrap()),
          _ => (),
        }
      }
    });



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