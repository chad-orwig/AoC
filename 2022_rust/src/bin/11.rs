use std::collections::HashSet;

use lib::inputs::d11::PRIMARY;
use once_cell::sync::Lazy;
use regex::Regex;
use num_bigint::BigInt;
use num_traits::{One, Zero};

struct Monkey {
  items: Vec<BigInt>,
  count: u32,
  divisor: BigInt,
  item_test: Box<dyn Fn(&BigInt) -> bool>,
  operation: Box<dyn Fn(&BigInt) -> BigInt>,
  throw_options: (usize, usize),
}

const ITEM_TEST_LINE:Lazy<Regex> = Lazy::new(||Regex::new(r"^Test: divisible by (\d+)$").unwrap());
fn build_item_test(line: &str) -> (Box<impl Fn(&BigInt) -> bool>, BigInt) {
  let num_str = &ITEM_TEST_LINE.captures(line).unwrap()[1];
  let num = num_str.parse::<BigInt>().unwrap();
  let num_clone = num.clone();

  let test = Box::new(move |worry: &BigInt| -> bool {worry % &num == BigInt::zero()});
  return (test, num_clone);
}

const OPERATION_LINE: Lazy<Regex> = Lazy::new(||Regex::new(r"Operation: new = old (\+|\*) (.*)$").unwrap());
fn build_operation(line: &str) -> Box<impl Fn(&BigInt) -> BigInt> {
  let captures = OPERATION_LINE.captures(line).unwrap();
  let operator = match &captures[1] {
    "*" => |a: &BigInt ,b: &BigInt| {a * b},
    "+" => |a: &BigInt ,b: &BigInt| {a + b},
    _ => panic!("Unexpected operator: {}", &captures[1]),
  };
  let second_num_option = captures[2].parse::<BigInt>();
  let has_second_num = second_num_option.is_ok();
  let second_num = second_num_option.unwrap_or_default();

  let operation = Box::new(move |old: &BigInt| -> BigInt {
    let this_second_num = if has_second_num {&second_num} else {old};
    operator(old, &this_second_num)
  });

  return operation;
}
fn main() {
  let result_regex = Regex::new(r"^\s+If (true|false): throw to monkey (\d+)$").unwrap();
  let mut monkeys = PRIMARY.split("\n\n")
    .map(|block| {
      let mut lines = block.split("\n");
      let items = lines.nth(1)
        .and_then(|l| l.strip_prefix("Starting items: "))
        .unwrap()
        .split(", ")
        .map(str::parse::<BigInt>)
        .map(Result::unwrap)
        .collect::<Vec<_>>();
      let operation = build_operation(lines.next().unwrap());
      let (item_test, divisor) = build_item_test(lines.next().unwrap());
      let throw_vec = lines
        .map(|s| result_regex.captures(s))
        .map(Option::unwrap)
        .map(|c| String::from(&c[2]))
        .map(|s| s.parse::<usize>())
        .map(Result::unwrap)
        .collect::<Vec<_>>();
      let throw_options = (throw_vec[0], throw_vec[1]);
      Monkey{
        items,
        count: 0,
        divisor,
        item_test,
        operation,
        throw_options,
      }
    }).collect::<Vec<_>>();

    let magic_factor = monkeys.iter()
      .map(|m| m.divisor.clone())
      .collect::<HashSet<_>>()
      .iter()
      .fold(BigInt::one(), |a,b| a * b);

    for _ in 0..10000 {
      for monkey_index in 0..monkeys.len() {
        let monkey = &monkeys[monkey_index];
        let new_owners = monkey.items.iter()
          .map(|worry|(*monkey.operation)(&worry))
          .map(|worry| worry % &magic_factor)
          .map(|worry|{
            let test_result = (*monkey.item_test)(&worry);
            (worry, test_result)
          })
          .map(|(worry, test)|(worry, if test {monkey.throw_options.0} else {monkey.throw_options.1}))
          .collect::<Vec<_>>();

        let monkey_mut = &mut monkeys[monkey_index];
        monkey_mut.count += monkey_mut.items.len() as u32;

        monkey_mut.items.clear();
        new_owners.into_iter()
          .for_each(|(worry, new_owner_index)| {
            monkeys[new_owner_index].items.push(worry);
          });
      }
      // monkeys.iter().enumerate().for_each(|(i, m)| println!("Monkey {}: {:?}", i, m.items));
      // println!("=====");
    }
    monkeys.sort_by(|m1,m2| m2.count.cmp(&m1.count));

    let monkey_biz = monkeys.iter().take(2).fold(BigInt::one(),|a,b| a * BigInt::from(b.count));

    println!("{}", monkey_biz);
}