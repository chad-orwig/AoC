use std::ops::{Add, Mul};

use itertools::Itertools;
use lib::inputs::d7::PRIMARY;
use num_bigint::BigInt;
use rayon::iter::{IntoParallelRefIterator, ParallelIterator};

trait Concatenate<Rhs = Self> {
    type Output;
    fn concatenate(self, rhs: Rhs) -> Self::Output;
}

impl Concatenate for &BigInt {
    type Output = BigInt;

    fn concatenate(self, rhs: Self) -> Self::Output {
        return (self.to_string() + &rhs.to_string()).parse().unwrap();
    }
}

fn all_ops_p1((left, right): (&BigInt, &BigInt)) -> Vec<BigInt> {
    return vec![left.add(right), left.mul(right)];
}
fn all_ops_p2((left, right): (&BigInt, &BigInt)) -> Vec<BigInt> {
    return vec![left.add(right), left.mul(right), left.concatenate(right)];
}
fn can_work(val: &BigInt, operands: &Vec<BigInt>, ops_fn: impl Fn((&BigInt, &BigInt)) -> Vec<BigInt>) -> bool {
    let results = operands[1..].iter()
        .fold(vec![operands[0].clone()], |left_vec, right| left_vec.iter()
            .flat_map(|left| if left > val { vec![left.clone()] } else { ops_fn((left, right)) })
            .collect_vec()
        );
    return results.iter().any(|result| result.eq(val));
}
fn main() {
    let input = PRIMARY.split("\n")
        .map(|line| line.split(": ")
            .collect_tuple()
            .unwrap()
        )
        .map(|(val_str, operands_str)| (val_str.parse::<BigInt>().unwrap(), operands_str.split_whitespace()
            .flat_map(str::parse::<BigInt>)
            .collect_vec()
        ))
        .collect_vec();

    let p1: BigInt = input.par_iter()
        .filter(|(val, operands)| can_work(val, operands, all_ops_p1))
        .map(|(val, _)|val)
        .sum();

    let p2: BigInt = input.par_iter()
        .filter(|(val, operands)| can_work(val, operands, all_ops_p2))
        .map(|(val, _)|val)
        .sum();

    println!("{:?}", p1);

    print!("{}", p2);
}