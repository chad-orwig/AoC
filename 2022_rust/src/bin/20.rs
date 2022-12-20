#![feature(linked_list_cursors)]
use std::collections::LinkedList;
use std::str::FromStr;
use std::fmt::Debug;

use lib::inputs::d20::*;
use num::PrimInt;

fn get_input<T>() -> impl Iterator<Item = T> 
where T: PrimInt + FromStr, <T as FromStr>::Err: Debug {
  PRIMARY.split("\n")
    .map(str::parse)
    .map(Result::unwrap)
    
}

fn is_value<T: PartialEq + Copy> (v:T) -> impl Fn(&T) -> bool {
  move |other: &T| other == &v
}

fn main () {
  let mut nums = get_input::<i64>()
    .map(|v| (v, false))
    .collect::<LinkedList<_>>();

  let len = nums.len();

  let mut seen = 0usize;

  let mut cur = nums.cursor_front_mut();
  while seen < len {
    let mut after = cur.split_after();
    let mut before = cur.split_before();
    // println!("==========");
    // println!("{:?}", before);
    // println!("{:?}", cur.current());
    // println!("{:?}", after);
    // println!("==========");
    match cur.remove_current() {
      None => {
        cur.splice_before(before);
        cur.splice_after(after);
        cur.move_next();
      },
      Some((v, true)) => {
        before.push_back((v, true));
        cur.splice_before(before);
        cur.splice_after(after);
      }
      Some((v, false)) => {
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
            c2.insert_before((v, true));
          },
          s if (half_after..after_len).contains(&s) => {
            let actual_steps = after_len - s;
            let mut c2 = after.cursor_back_mut();
            for _ in 0..actual_steps {
              c2.move_prev();
            }
            c2.insert_after((v, true));
          },
          s if (after_len..after_len + half_before).contains(&s) => {
            let actual_steps = after_len - s;
            let mut c2 = before.cursor_front_mut();
            for _ in 0..actual_steps {
              c2.move_next();
            }
            c2.insert_before((v, true));
          },
          s if (after_len + half_before..).contains(&s) => {
            let actual_steps = total_len - s;
            let mut c2 = before.cursor_back_mut();
            for _ in 0..actual_steps {
              c2.move_prev();
            }
            c2.insert_after((v, true));
          },
          _ => panic!("Weird total step amount: {}", total_steps)
        }
        seen += 1;
        cur.splice_after(after);
        cur.splice_before(before);
        cur.move_next();
      }
    }
    
  }
  
  let num_i = nums.iter().collect::<Vec<_>>();

  let v0_index = num_i.iter() 
    .enumerate()
    .find(|(_,(v, _))| v == &0)
    .unwrap().0;
  let p1 = [1000 + v0_index,2000 + v0_index,3000 + v0_index].into_iter()
    .map(|i|i % num_i.len())
    .map(|i| num_i[i])
    .map(|(v,_)| v)
    .sum::<i64>();

  println!("{:?}", p1);


  let order = get_input::<i128>()
    .map(|v| v * 811589153)
    .collect::<Vec<_>>();

  let mut list = order
    .clone()
    .into_iter()
    .collect::<LinkedList<_>>();

  for _ in 0..10 {
    // println!("{:?}", list);
    mix(&mut list, &order);
  }

  let num_i = list.iter().collect::<Vec<_>>();
  // println!("{:?}", list);

  let v0_index = num_i.iter() 
    .enumerate()
    .find(|(_,v)| v == &&&0)
    .unwrap().0;

  let p2 = [1000 + v0_index,2000 + v0_index,3000 + v0_index].into_iter()
    .map(|i|i % num_i.len())
    .map(|i| num_i[i])
    .sum::<i128>();

  println!("{}", p2);
  
}

fn mix(list: &mut LinkedList<i128>, order: &Vec<i128>){
  for v in order {
    let i = list.iter()
      .enumerate()
      .find(|(_, v1)| v1 == &v)
      .expect(format!("Couldn't find {}", v).as_str()).0;

    let total_len = order.len() as i128 - 1;
    let people_to_jump = v % total_len;
    let mut other = list.split_off(i);

    let val = other.pop_front()
      .unwrap();

    let right_len = other.len() as i128;
    let left_len = list.len() as i128;


    match people_to_jump {
      x if (..left_len * - 1).contains(&x) => {
        let right_jumps = x + left_len;

        let right_i = right_len + right_jumps;
        let mut temp = other.split_off(right_i as usize);
        other.push_back(val);
        other.append(&mut temp);
      },
      x if (left_len * - 1..0).contains(&x) => {
        let left_i = left_len + x;
        let mut temp = list.split_off(left_i as usize);
        list.push_back(val);
        list.append(&mut temp);
      },
      0 => {
        list.push_back(val);
      },
      x if(1..right_len).contains(&x) => {
        let mut temp = other.split_off(x as usize);
        other.push_back(val);
        other.append(&mut temp);
      },
      x if(right_len..).contains(&x) => {
        let left_i = x - right_len;

        let mut temp = list.split_off(left_i as usize);

        list.push_back(val);
        
        list.append(&mut temp);

      },
      _ => panic!("Weird number to jump: {}", people_to_jump)
    }
    list.append(&mut other);
  }

}