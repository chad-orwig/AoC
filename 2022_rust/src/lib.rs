use std::hash::Hash;
use std::fmt::Debug;

use num::{Integer, Signed};

pub mod search;
pub mod strings;
pub mod inputs;
pub mod grid;

pub trait MinMax {
  fn get_min() -> Self;
  fn get_max() -> Self;
}

pub trait ChadNum: Integer + Signed + Debug + Hash + Eq + Ord + PartialEq + PartialOrd + Clone + Copy + MinMax {}

impl MinMax for i64 {
  fn get_min() -> Self {
    i64::MIN
  }

  fn get_max() -> Self {
    i64::MAX
  }
}

impl ChadNum for i64{}