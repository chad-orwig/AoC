#![feature(linked_list_cursors)]
use std::collections::LinkedList;
use std::str::FromStr;
use std::fmt::Debug;

use lib::inputs::d20::*;
use num::PrimInt;

fn get_input<T>() -> impl Iterator<Item = T> 
where T: PrimInt + FromStr, <T as FromStr>::Err: Debug {
  TEST.split("\n")
    .map(str::parse)
    .map(Result::unwrap)
    
}
fn main () {
  let mut nums = get_input::<i64>()
    .map(|v| (v, false, false))
    .collect::<LinkedList<_>>();

  let f = nums.front_mut().unwrap();
  f.2 = true;
  let len = nums.len();

  let mut seen = 0usize;

  let mut cur = nums.cursor_front_mut();
  while seen < len {
    let mut after = cur.split_after();
    let mut before = cur.split_before();
    println!("==========");
    println!("{:?}", before);
    println!("{:?}", cur.current());
    println!("{:?}", after);
    println!("==========");
    match cur.remove_current() {
      None => {
        cur.splice_before(before);
        cur.splice_after(after);
        cur.move_next();
      },
      Some((v, true, front)) => {
        before.push_back((v, true, front));
        cur.splice_before(before);
        cur.splice_after(after);
      }
      Some((v, false, front)) => {
        let after_len = after.len() as i64;
        let before_len = before.len() as i64;
        let half_after = after_len / 2;
        let half_before = before_len / 2;
        let total_len = before_len + after_len;

        let mut temp_v = v;
        while temp_v < 0 {
          temp_v += total_len;
        }

        let total_steps = temp_v % total_len;

        match total_steps {
          s if (..half_after).contains(&s) => {
            let mut c2 = after.cursor_front_mut();
            for _ in 0..s {
              c2.move_next();
            }
            c2.insert_before((v, true, false));
          },
          s if (half_after..after_len).contains(&s) => {
            let actual_steps = after_len - s;
            let mut c2 = after.cursor_back_mut();
            for _ in 0..actual_steps {
              c2.move_prev();
            }
            c2.insert_after((v, true, false));
          },
          s if (after_len..after_len + half_before).contains(&s) => {
            let actual_steps = after_len - s;
            let mut c2 = before.cursor_front_mut();
            for _ in 0..actual_steps {
              c2.move_next();
            }
            c2.insert_before((v, true, false));
          },
          s if (after_len + half_before..).contains(&s) => {
            let actual_steps = total_len - s;
            let mut c2 = before.cursor_back_mut();
            for _ in 0..actual_steps {
              c2.move_prev();
            }
            c2.insert_after((v, true, false));
          },
          _ => panic!("Weird total step amount: {}", total_steps)
        }
        if front {
          let f = after.front_mut().unwrap();
          f.2 = true;
        }
        seen += 1;
        cur.splice_after(after);
        cur.splice_before(before);
        cur.move_next();
      }
    }
    
  }

  let actual_front = nums.iter()
    .enumerate()
    .find(|(_, (_,_, front))| *front)
    .unwrap().0;

  
  let num_i = nums.iter().collect::<Vec<_>>();
  let t = 4;
  let p1 = [100 + 5,200 + 5,300 + 5].into_iter()
    .map(|i|i % num_i.len())
    .map(|i| num_i[i])
    .map(|(v,_, _)| v)
    .collect::<Vec<_>>();
    // .sum::<i64>();

  println!("{:?}", num_i);
  println!("{:?}", p1);
  
  let demo = vec![1,2,-3,4,3,-2];

  let v0_index = 4;

  assert_eq!(4,  demo[(101 + v0_index) % demo.len()]);
}