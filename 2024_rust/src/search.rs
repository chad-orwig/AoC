use std::{collections::HashSet, fmt::Debug, hash::Hash};

use priority_queue::PriorityQueue;

pub trait Searchable: Hash + Eq {
    type PriorityType:PartialOrd+Ord;
    fn next_states(&self) -> impl Iterator<Item = Self>;
    fn priority(&self) -> Self::PriorityType;
    fn complete(&self) -> bool;
    fn merge(self, priority: Self::PriorityType, other: Self, other_priority: Self::PriorityType) -> Self;
}

pub fn default_merge<T:Searchable>(me: T, priority: T::PriorityType, other: T, other_priority: T::PriorityType) -> T {
    match priority.cmp(&other_priority) {
        std::cmp::Ordering::Less => other,
        std::cmp::Ordering::Equal => me,
        std::cmp::Ordering::Greater => me,
    }
}

pub fn search<T: Searchable+Debug>(initial: Vec<T>, allow_dups: bool) -> Option<(T, PriorityQueue<T, T::PriorityType>)> {
    let mut q = PriorityQueue::new();
    let mut seen: HashSet<T> = HashSet::new();
    initial.into_iter()
        .for_each(|item| {
            let priority = item.priority();
            q.push(item, priority);
        });
    let mut count = 0;
    while let Some((item, _)) = q.pop() {
        if item.complete() { return Some((item, q)); }
        for new_item in item.next_states() {
            if allow_dups || !seen.contains(&new_item) {
                let priority = new_item.priority();
                let other_option = q.remove(&new_item);
                if let Some((other, other_priority)) = other_option  {
                    let merged_item = new_item.merge(priority, other, other_priority);
                    let merged_priority = merged_item.priority();
                    q.push(merged_item, merged_priority);
                }
                else{
                    q.push(new_item, priority);
                }
            }
            
        }
        if count == 100000 {
            count = 0;
            println!("{:?}", item);
        }
        else {
            count += 1;
        }
        if !allow_dups { seen.insert(item); }
    }
    return None;
}