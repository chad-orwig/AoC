use itertools::Itertools;
use lib::inputs::d2::PRIMARY;
use num_traits::{PrimInt, Signed};

fn level_is_kinda_safe<T:Signed + PrimInt>(level:&&Vec<T>) -> bool {
    let mut levels_without = (0..level.len())
        .map(|i| {
            let mut clone = level.to_vec();
            clone.remove(i);
            return clone;
        })
        .collect_vec();
    levels_without.push(level.to_vec());

    return levels_without.iter()
        .map(|l| level_is_safe(&l))
        .any(|b|b);
}

fn level_is_safe<T:Signed + PrimInt>(level:&&Vec<T>) -> bool {
    if level.len() < 2 { return false; };

    return level.windows(2)
        .map(|w|w.into_iter().collect_tuple().unwrap())
        .map(|(left, right)| *left - *right)
        .collect_vec()
        .windows(2)
        .map(|w|w.into_iter().collect_tuple().unwrap())
        .map(|(left, right)| {
            return 
            (( left > &T::zero() && right > &T::zero() ) || (left < &T::zero() && right < &T::zero()))
            && (left.abs() < T::from(4).unwrap())
            && (right.abs() < T::from(4).unwrap())
        })
        .all(|b|b);
}

fn main() {
    let levels = PRIMARY.split("\n")
        .map(|line| line.split_whitespace()
            .map(str::parse::<i64>)
            .map(Result::unwrap)
            .collect_vec()
        )
        .collect_vec();

    let safe_count = levels.iter()
        .filter(level_is_safe)
        .count();

    println!("{}", safe_count);

    let kinda_safe_count = levels.iter()
        .filter(level_is_kinda_safe)
        .count();

        println!("{}", kinda_safe_count);
}