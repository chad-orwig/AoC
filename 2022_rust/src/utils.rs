use std::{hash::Hash, collections::HashSet};

use priority_queue::PriorityQueue;

pub trait Searchable<K: Hash + Eq, P: Ord> {
  fn key(&self) -> K;
  fn priority(&self) -> P;
  fn finished(&self) -> bool;
}

pub fn search<S: Searchable<K, P> + Eq + Hash, K: Eq + Hash, P: Ord>(
  start: Vec<S>,
  find_next_states: impl Fn(&S) -> Vec<S>,
) -> Option<S> {
  let mut seen = HashSet::new();
  let mut q = PriorityQueue::new();

  start.into_iter()
    .for_each(|s| {
      let priority = s.priority();
      q.push(s, priority);
    });

  while !q.is_empty() {
    let (s,_) = q.pop().unwrap();
    let k = s.key();
    if s.finished() { return Some(s); }
    seen.insert(k);

    find_next_states(&s).into_iter()
      .filter(|s| !seen.contains(&s.key()))
      .for_each(|s| {
        let priority = s.priority();
        q.push(s, priority);
      });
  }

  None
}

pub struct FunctionalSplit<'a> {
  line: &'a str,
  finished: bool,
  loc: usize,
  next_index: &'a dyn Fn(&str) -> Option<usize>
}

pub trait FunctionallySplittable<'a> {
  fn functional_split(&'a self, splitter: &'a dyn Fn(&str) -> Option<usize>) -> FunctionalSplit<'a>;
}

impl<'a> FunctionallySplittable<'a> for str {
    fn functional_split(&'a self, splitter: &'a dyn Fn(&str) -> Option<usize>) -> FunctionalSplit<'a> {
      FunctionalSplit { line: self, finished: false, loc: 0, next_index: splitter }
    }
}

impl<'a> Iterator for FunctionalSplit<'a> {
    type Item = &'a str;

    fn next(&mut self) -> Option<Self::Item> {
      if self.finished { return None; }
      let i = (self.next_index)(&self.line[self.loc..]);

      let start = self.loc.clone();

      match i {
        Some(index) => {
          self.loc = start + index + 1;
          self.finished = self.loc == self.line.len();
          return Some(&self.line[start..index + start]);
        }
        None => {
          self.finished = true;
          return if self.loc == self.line.len() { None } else { Some(&self.line[self.loc..])}
        }
      }
    }
}