use std::{collections::HashMap, fmt::{self, Formatter}, str::FromStr, vec::IntoIter};

use itertools::Itertools;
use lib::inputs::d11::PRIMARY;
use timelog::Timer;

#[derive(Clone, PartialEq, Eq, Hash)]
struct Stone {
    num: u128,
}
impl Stone {
    fn to_string(&self) -> String {
        return self.num.to_string();
    }
}
impl fmt::Debug for Stone {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        return self.num.fmt(f);
    }
}
#[derive(Debug)]
struct ParseStoneError;
impl FromStr for Stone {
    type Err = ParseStoneError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        return u128::from_str(s)
            .map(|num| Stone { num })
            .map_err(|_| ParseStoneError);
    }
}
impl IntoIterator for Stone {
    type Item = Stone;

    type IntoIter = IntoIter<Stone>;

    fn into_iter(self) -> Self::IntoIter {
        let s = self.to_string();
        return match (self.num, s.len() % 2) {
            (0, _) => vec![Stone{ num: 1 }].into_iter(),
            (_, 0) => {
                let (s1, s2) = s.split_at(s.len() / 2);
                return vec![
                    Stone::from_str(s1).unwrap(),
                    Stone::from_str(s2).unwrap(),
                ].into_iter();
            }
            _ => {
                let new_num = self.num * 2024;
                return vec![Stone{ num: new_num}].into_iter();
            }

        }
    }
}

fn stone_stuff<'a>(stone: Stone, blinks: u32, cache: &'a mut HashMap<String, u128>) -> u128 {

    if blinks == 0 { return 1; }
    let key = format!("{}-{}", stone.num, blinks);
    if cache.contains_key(&key) {
        return cache.get(&key).unwrap().clone();
    }
    let s = stone.to_string();
    let result =  match (stone.num, s.len() % 2) {
        (0, _) => stone_stuff(Stone{ num: 1 }, blinks-1, cache),
        (_, 0) => {
            let (s1, s2) = s.split_at(s.len() / 2);
            stone_stuff(Stone::from_str(s1).unwrap(), blinks - 1, cache) +
                stone_stuff(Stone::from_str(s2).unwrap(), blinks - 1, cache)
        }
        _ => {
            let new_num = stone.num * 2024;
            stone_stuff(Stone{ num: new_num}, blinks - 1, cache)
        }
    };
    cache.insert(key, result);
    return result;
}
fn main() {
    let original_input = PRIMARY.split_whitespace()
        .flat_map(Stone::from_str)
        .collect_vec();

    let mut p1_vec= vec![original_input[0].clone()];

    for _ in 0..25 {
        p1_vec = p1_vec.into_iter().flat_map(|s| s.into_iter()).collect_vec();
    }

    println!("{}", p1_vec.len());

    let mut timer = Timer::new();
    timer.time("counts only");

    let mut p2_counts= original_input.clone().into_iter()
        .counts();

    for _ in 0..75 {

        p2_counts = p2_counts.into_iter().flat_map(|(s,count)| s.into_iter().map(move |s| (s, count)))
            .fold(HashMap::new(), |mut map, (s, count)| {
                let cur_count = map.get(&s).unwrap_or(&0);
                map.insert(s, cur_count + count);

                return map;
            });

    }
    let p2:usize = p2_counts.values().sum();
    timer.time_end("counts only", false);

    println!("{}", p2);

    timer.time("memo");

    let mut stone_memo:HashMap<String, u128> = HashMap::new();

    let p2_memo = original_input.into_iter()
        .fold(0, |sum: u128, stone| sum + stone_stuff(stone, 75, &mut stone_memo));

    timer.time_end("memo", false);
    println!("{p2_memo}");


}