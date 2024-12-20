use std::{cmp::Reverse, collections::{HashMap, HashSet}, fmt::{self, Debug}, hash::{Hash, Hasher}, usize};

use itertools::Itertools;
use lib::{inputs::d19::{PRIMARY, TEST}, search::{default_merge, search, Searchable}};

struct Pattern<'a> {
    count: usize,
    target: &'a str,
    progress: String,
    available: &'a Vec<&'a str>
}

impl Debug for Pattern<'_> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("Pattern").field("target", &self.target).field("progress", &self.progress).finish()
    }
}

impl Hash for Pattern<'_> {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.target.hash(state);
        self.progress.hash(state);
    }
}

impl PartialEq for Pattern<'_> {
    fn eq(&self, other: &Pattern) -> bool {
        self.target == other.target && self.progress == other.progress
    }
}

impl Eq for Pattern<'_> {}

impl <'a> Searchable for Pattern <'a> {
    type PriorityType = Reverse<usize>;

    fn next_states(&self) -> impl Iterator<Item = Self> {
        self.available.iter()
            .map(|towel| {
                let mut s = self.progress.clone();
                s.push_str(*towel);
                s
            })
            .filter(|progress| self.target.starts_with(progress))
            .map(|progress| Pattern {
                count: self.count,
                target: self.target,
                progress,
                available: self.available,
            })
    }

    fn priority(&self) -> Self::PriorityType {
        Reverse(self.progress.len())
    }

    fn complete(&self) -> bool {
        self.progress.as_str() == self.target
    }

    fn merge(mut self, _priority: Self::PriorityType, other: Self, _other_priority: Self::PriorityType) -> Self {
        self.count += other.count;
        self
    }
}

fn main() {
    let (available_str, patterns_str) = PRIMARY
        .split("\n\n")
        .collect_tuple()
        .unwrap();

    let available = available_str.split(", ")
        .collect_vec();

    let patterns = patterns_str.lines()
        .map(|target| Pattern {
            count: 1,
            target,
            progress: String::from(""),
            available: &available,
        })
        .collect_vec();

    let valid = patterns.into_iter()
        .map(|p| vec![p])
        .flat_map(|v| search(v, true))
        .collect_vec();
    
    let p1 = valid.len();

    println!("{p1}");

    let p2 = valid.iter()
        .map(|(p, _)| p.count)
        .sum::<usize>();

    println!("{:?}", p2);

}