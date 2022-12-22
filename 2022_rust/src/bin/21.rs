use std::{collections::HashMap, str::FromStr};

use lib::inputs::d21::*;
use once_cell::sync::Lazy;
use regex::Regex;

trait MonkeyNumber {
  fn get_number(&self, monkeys: &HashMap<String, impl MonkeyNumber>) -> i64;
}
#[derive(Debug)]
enum Monkey {
  Base(i64),
  Add(String, String),
  Sub(String, String),
  Mul(String, String),
  Div(String, String),
  Unk,
}

#[derive(Debug, PartialEq, Eq)]
enum Op {
  Add,
  Sub,
  Mul,
  Div,
}

impl MonkeyNumber for Monkey{
  fn get_number(&self, monkeys: &HashMap<String, impl MonkeyNumber>) -> i64 {
      match self {
        Monkey::Base(v) => v.clone(),
        Monkey::Add(lhs, rhs) => monkeys[lhs].get_number(monkeys) + monkeys[rhs].get_number(monkeys),
        Monkey::Sub(lhs, rhs) => monkeys[lhs].get_number(monkeys) - monkeys[rhs].get_number(monkeys),
        Monkey::Mul(lhs, rhs) => monkeys[lhs].get_number(monkeys) * monkeys[rhs].get_number(monkeys),
        Monkey::Div(lhs, rhs) => monkeys[lhs].get_number(monkeys) / monkeys[rhs].get_number(monkeys),
        Monkey::Unk => panic!("I'm unknown"),
      }
  }
}

impl FromStr for Monkey {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
      if Monkey::BASE_REGEX.is_match(s) {
        Ok(Monkey::Base(s.parse::<i64>().unwrap()))
      }
      else {
        let captures = Monkey::OP_REGEX.captures(s)
          .ok_or(String::from("Doesn't match base or OP regex"))?;

        let lhs = captures[1].to_owned();
        let rhs = captures[3].to_owned();

        match &captures[2] {
          "+" => Ok(Monkey::Add(lhs, rhs)),
          "-" => Ok(Monkey::Sub(lhs, rhs)),
          "*" => Ok(Monkey::Mul(lhs, rhs)),
          "/" => Ok(Monkey::Div(lhs, rhs)),
          x => Err(format!("unknown op {}", x)),
        }

      }
    }
}


impl Monkey {
  const BASE_REGEX: Lazy<Regex> = Lazy::new(||Regex::new(r"^\d+$").unwrap());
  const OP_REGEX: Lazy<Regex> = Lazy::new(||Regex::new(r"^(\w+) (.) (\w+)$").unwrap());


  fn to_string(&self, monkeys: &HashMap<String, Monkey>) -> String {
    
    match self {
      Monkey::Unk => "x".to_owned(),
      Monkey::Base(v) => v.to_string(),
      Monkey::Add(lhs, rhs) => {
        let left_monk = monkeys[lhs].to_string(monkeys);
        let right_monk = monkeys[rhs].to_string(monkeys);
        match (left_monk.parse::<i64>(), right_monk.parse::<i64>()) {
          (Ok(l), Ok(r)) => (l + r).to_string(),
          (Ok(l), Err(_)) => format!("({} + {})", l, right_monk),
          (Err(_), Ok(r)) => format!("({} + {})", left_monk, r),
          _ => format!("({} + {})",left_monk, right_monk),
        }

      },
      Monkey::Sub(lhs, rhs) => {
        let left_monk = monkeys[lhs].to_string(monkeys);
        let right_monk = monkeys[rhs].to_string(monkeys);

        match (left_monk.parse::<i64>(), right_monk.parse::<i64>()) {
          (Ok(l), Ok(r)) => (l - r).to_string(),
          (Ok(l), Err(_)) => format!("({} - {})", l, right_monk),
          (Err(_), Ok(r)) => format!("({} - {})", left_monk, r),
          _ => format!("({} - {})",left_monk, right_monk),
        }

      },
      Monkey::Mul(lhs, rhs) => {
        let left_monk = monkeys[lhs].to_string(monkeys);
        let right_monk = monkeys[rhs].to_string(monkeys);

        match (left_monk.parse::<i64>(), right_monk.parse::<i64>()) {
          (Ok(l), Ok(r)) => (l * r).to_string(),
          (Ok(l), Err(_)) => format!("({} * {})", l, right_monk),
          (Err(_), Ok(r)) => format!("({} * {})", left_monk, r),
          _ => format!("({} * {})",left_monk, right_monk),
        }

      },
      Monkey::Div(lhs, rhs) => {
        let left_monk = monkeys[lhs].to_string(monkeys);
        let right_monk = monkeys[rhs].to_string(monkeys);

        match (left_monk.parse::<i64>(), right_monk.parse::<i64>()) {
          (Ok(l), Ok(r)) => (l / r).to_string(),
          (Ok(l), Err(_)) => format!("({} / {})", l, right_monk),
          (Err(_), Ok(r)) => format!("({} / {})", left_monk, r),
          _ => format!("({} / {})",left_monk, right_monk),
        }

      },
    }
  }
}


impl FromStr for Op {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
      match s {
        "+" => Ok(Op::Add),
        "-" => Ok(Op::Sub),
        "*" => Ok(Op::Mul),
        "/" => Ok(Op::Div),
        _ => Err(format!("Not an op {}", s)),
      }
    }
}

impl Op {
  fn inverse(&self) -> Op {
    match self {
      Op::Add => Op::Sub,
      Op::Sub => Op::Add,
      Op::Mul => Op::Div,
      Op::Div => Op::Mul,
    }
  }
  fn execute(&self, lhs: &i64, rhs: &i64) -> i64 {
    match self {
      Op::Add => lhs + rhs,
      Op::Sub => lhs - rhs,
      Op::Mul => lhs * rhs,
      Op::Div => lhs / rhs,
    }
  }
}
fn main() {
  let mut monkeys = PRIMARY.split("\n")
    .map(|line| line.split_once(": ").unwrap())
    .map(|(name, s)| (name.to_owned(), s.parse().unwrap()))
    .collect::<HashMap<String, Monkey>>();

  // let p1 = monkeys["root"].get_number(&monkeys);

  // println!("{}", p1);

  let human = "humn".to_owned();

  monkeys.remove(&human);
  monkeys.insert(human, Monkey::Unk);

  println!("{:?}", monkeys["root"]);

  let prob = monkeys["pnhm"].to_string(&monkeys);
  let mut s = prob.strip_prefix("(").and_then(|s| s.strip_suffix(")")).unwrap().to_owned();
  let mut v = monkeys["zvcm"].get_number(&monkeys);
  println!("{}", v);

  let right_op = Regex::new(r"^\((.*)\) (/|\*|\+|\-) (\d+)$").unwrap();
  let left_op = Regex::new(r"^(\d+) (/|\*|\+|\-) \((.*)\)$").unwrap();
  while s != "x - 415" {
    let val: i64;
    let op: Op;
    if s.starts_with("(") {
      let captures = right_op.captures(&s).expect(&s);
      val = captures[3].parse().unwrap();
      op = captures[2].parse().unwrap();
      s = captures[1].to_owned();

      let inverse = op.inverse();
  
      v = inverse.execute(&v, &val);
    }
    else {
      let captures = left_op.captures(&s).expect(&s);
      val = captures[1].parse().unwrap();
      op = captures[2].parse().unwrap();
      s = captures[3].to_owned();

      if op == Op::Div || op == Op::Sub{
        v = op.execute(&val, &v);
      }
      else {
        let inverse = op.inverse();
        v = inverse.execute(&v, &val);
      }
    }
  }

  println!("{}", v + 415);
}