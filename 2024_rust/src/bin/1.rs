use itertools::Itertools;
use lib::inputs::d1::PRIMARY;
use regex::Regex;



fn main() {
  let space:Regex = Regex::new(r"\s+").unwrap();
  let list = PRIMARY.split("\n")
  .map(|line| space.split(line)
    .map(str::parse::<i64>)
    .map(Result::unwrap)
    .collect_tuple::<(i64,i64)>()
    .unwrap())
  .collect_vec();

  let lefts = list.iter().map(|(left, _right)| left).sorted().collect_vec();
  let rights = list.iter().map(|(_left, right)| right).sorted().collect_vec();

  let total_diff = lefts.iter()
    .enumerate()
    .map(|(i, left)| *left - rights[i])
    .map(i64::abs)
    .sum::<i64>();

  println!("{}", total_diff);

  let right_counts = rights.iter().counts();

  let sim_score = lefts.iter()
    .map(|l|*l * (*right_counts.get(l).unwrap_or(&0) as i64))
    .sum::<i64>();

    println!("{}", sim_score);


}