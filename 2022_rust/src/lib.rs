use std::hash::Hash;
use std::fmt::Debug;

use num::{Integer, Signed};

pub mod search;
pub mod strings;
pub mod inputs;
pub mod grid;

pub trait ChadNum: Integer + Signed + Debug + Hash + Eq + Ord + PartialEq + PartialOrd + Clone {}

impl ChadNum for i64{}