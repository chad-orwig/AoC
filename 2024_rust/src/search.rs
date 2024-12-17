use std::{collections::BTreeSet, hash::Hash};

use priority_queue::PriorityQueue;

pub trait Searchable: Hash + Eq {
    type PriorityType:PartialOrd+Ord;
    type KeyType:PartialOrd+Ord+Eq;
    fn next_states(&self) -> impl Iterator<Item = Self>;
    fn priority(&self) -> Self::PriorityType;
    fn complete(&self) -> bool;
    fn key(&self) -> Self::KeyType;
}

pub fn search<T: Searchable>(initial: Vec<T>) -> Option<(T, PriorityQueue<T, T::PriorityType>, BTreeSet<T::KeyType>)> {
    let mut q = PriorityQueue::new();
    let mut seen = BTreeSet::new();
    initial.into_iter()
        .for_each(|item| {
            let priority = item.priority();
            q.push(item, priority);
        });

    while let Some((item, _)) = q.pop() {
        if item.complete() { return Some((item, q, seen)); }
        
        for new_item in item.next_states() {
            if !seen.contains(&new_item.key()) {
                let priority = new_item.priority();
                q.push(new_item, priority);
            }
        }
        seen.insert(item.key());
    }

    return None;

}