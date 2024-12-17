use std::{hash::Hash, fmt::Debug};

use priority_queue::PriorityQueue;

pub trait Searchable: Hash + Eq {
    type PriorityType:PartialOrd+Ord;
    type KeyType:PartialOrd+Ord+Eq;
    fn next_states(&self) -> impl Iterator<Item = Self>;
    fn priority(&self) -> Self::PriorityType;
    fn complete(&self) -> bool;
    fn merge(self, priority: Self::PriorityType, other: Self, other_priority: Self::PriorityType) -> Self;
}

pub fn search<T: Searchable+Debug>(initial: Vec<T>) -> Option<(T, PriorityQueue<T, T::PriorityType>)> {
    let mut q = PriorityQueue::new();
    initial.into_iter()
        .for_each(|item| {
            let priority = item.priority();
            q.push(item, priority);
        });
    let mut count = 0;
    while let Some((item, _)) = q.pop() {
        if item.complete() { return Some((item, q)); }
        
        for new_item in item.next_states() {
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
        if count == 100000 {
            count = 0;
            println!("{:?}", item);
        }
        else {
            count += 1;
        }
    }
    return None;
}