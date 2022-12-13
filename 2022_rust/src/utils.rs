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