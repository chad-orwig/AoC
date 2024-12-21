use std::{collections::HashSet, fmt::Debug, hash::Hash};

use priority_queue::PriorityQueue;

pub trait Searchable: Hash + Eq {
    type PriorityType:PartialOrd+Ord;
    fn next_states(&self) -> impl Iterator<Item = Self>;
    fn priority(&self) -> Self::PriorityType;
    fn complete(&self) -> bool;
    fn merge(self, other: Self) -> Self;
}

pub fn default_merge<T:Searchable>(me: T, other: T) -> T {
    match me.priority().cmp(&other.priority()) {
        std::cmp::Ordering::Less => other,
        std::cmp::Ordering::Equal => me,
        std::cmp::Ordering::Greater => me,
    }
}

fn search_step<T:Searchable>(q: &mut PriorityQueue<T, T::PriorityType>, seen: &mut HashSet<T>, item: &T, allow_dups: bool) {
    for new_item in item.next_states() {
        if allow_dups || !seen.contains(&new_item) {
            let other_option = q.remove(&new_item);
            if let Some((other, _other_priority)) = other_option  {
                let merged_item = new_item.merge( other);
                let merged_priority = merged_item.priority();
                q.push(merged_item, merged_priority);
            }
            else{
                let priority = new_item.priority();
                q.push(new_item, priority);
            }
        }
        
    }
}

pub fn keep_searching<T: Searchable+Debug>(allow_dups: bool, mut q: PriorityQueue<T, T::PriorityType>,mut seen: HashSet<T>) -> Option<(T, PriorityQueue<T, T::PriorityType>, HashSet<T>)> {
    let mut count = 0;
    while let Some((item, _)) = q.pop() {
        if item.complete() { return Some((item, q, seen)); }
        search_step(&mut q, &mut seen, &item, allow_dups);
        if count == 10000000 {
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

pub fn search<T: Searchable+Debug>(initial: Vec<T>, allow_dups: bool) -> Option<(T, PriorityQueue<T, T::PriorityType>, HashSet<T>)> {
    let mut q = PriorityQueue::new();
    let mut seen: HashSet<T> = HashSet::new();
    initial.into_iter()
        .for_each(|item| {
            let priority = item.priority();
            q.push(item, priority);
        });
    keep_searching(allow_dups, q, seen)
}