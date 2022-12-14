use std::{cmp::{min}, fmt::{Debug, Error}};

use lib::{inputs::d13::PRIMARY, utils::strings::FunctionallySplittable};

#[derive(PartialEq, Eq, Hash, Clone)]
struct Packet {
  num: Option<u64>,
  list: Option<Vec<Packet>>
}

#[derive(Debug)]
struct Pair {
  left: Vec<Packet>,
  right: Vec<Packet>
}


impl Debug for Packet {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {

    match (self.num, &self.list) {
      (Some(n), None) => n.fmt(f),
      (None, Some(l)) => f.debug_list().entries(l).finish(),
      _ => Err(Error),
    }
  }
}

impl PartialOrd for Packet {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

impl Ord for Packet {
  fn cmp(&self, other: &Self) -> std::cmp::Ordering {
    match (self.num.as_ref(), other.num.as_ref()) {
      (Some(my_num), Some(their_num)) => return my_num.cmp(their_num),
      (None, None) => {
        let my_list = self.list.as_ref().unwrap();
        let their_list = other.list.as_ref().unwrap();
        let max_length = min(my_list.len(), their_list.len());
        for i in 0..max_length {
          let compare = my_list[i].cmp(&their_list[i]);
          if compare.is_ne() { return compare; }
        }
        my_list.len().cmp(&their_list.len())
      },
      (Some(_), None) => return Packet { num: None, list: Some(vec![self.clone()])}.cmp(other),
      (None, Some(_)) => return self.cmp(&Packet { num: None, list: Some(vec![other.clone()])}),
    }
  }
}

impl Packet {
    fn from(line: &str) -> Result<Self, String> {
      if !line.starts_with("[") { return Ok(Packet {
        num: Some(line.parse().map_err(|_| "Failed to parse num")?),
        list: None,
      });}
      
      let list: Result<Vec<Packet>, String> = line.strip_prefix("[").ok_or("prefix wrong")
        ?.strip_suffix("]").ok_or(format!("suffix wrong {}", line))
        ?.functional_split(&line_splitter)
        .map(Packet::from)
        .collect();

      Ok(Packet {
        list: Some(list?),
        num: None,
      })
    }
}

impl Pair {
    fn from(line: &str) -> Result<Self, String> {
      let packets = line.split("\n")
        .map(Packet::from)
        .collect::<Result<Vec<Packet>, String>>()?;

      let mut i = packets.into_iter();

      let left = i.next().ok_or("Missing left packet")?;
      let right = i.next().ok_or("Missing Right Packet")?;

      if i.next().is_some(){ return Err(String::from("More than two packets in Pair"));}

      Ok(Pair {
        left: left.list.ok_or("left item in pair was not a list")?,
        right: right.list.ok_or("right item in pair was not a list")?,
      })
    }
}


fn line_splitter(line: &str) -> Option<usize> {
  let mut depth = 0u32;
  line.char_indices()
    .find(|(_, c)| {
      match c {
        '[' => {depth += 1; return false;},
        ']' => {depth -= 1; return false},
        ',' => return depth == 0,
        _ =>  return  false,
      }
    }).map(|(i, _)| i)
}

fn main() {
  let pairs: Vec<Pair> = PRIMARY.split("\n\n")
    .map(Pair::from)
    .map(Result::unwrap)
    .collect();

  let p1: usize = pairs.iter()
    .enumerate()
    .filter(|(_, p)| p.left < p.right)
    .map(|(i,_)| i + 1)
    .sum();

  println!("{:?}", p1);

  let mut packets: Vec<_> = pairs.into_iter()
    .flat_map(|pair|vec![pair.left, pair.right].into_iter())
    .map(|list| Packet {
      list: Some(list),
      num: None,
    }).collect();

  let dividers = (Packet::from("[[2]]").unwrap(), Packet::from("[[6]]").unwrap());
  
  packets.push(dividers.0.clone());
  packets.push(dividers.1.clone());

  packets.sort();

  let p2 = packets.iter()
    .enumerate()
    .filter(|(_,p)| (**p == dividers.0 || **p == dividers.1))
    .map(|(i, _)| i + 1)
    .reduce(|a,b| a * b)
    .unwrap();

  println!("{}", p2);
  
}