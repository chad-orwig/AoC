use std::{collections::{HashMap, HashSet}, hash::Hash, iter::once, str::Chars};

use itertools::Itertools;
use lib::{inputs::d21::{PRIMARY, TEST}, Loc, OrthoganalDirection};
use rayon::iter::{IntoParallelIterator, ParallelBridge, ParallelIterator};

struct Keypad {
    buttons: HashMap<char, Loc<usize>>,
    loc: Loc<usize>,
    danger_row: usize,
    danger_col: usize,
}
struct SubSequence {
    target: String,
    current_target_char: usize,
    current_result_char: usize,
    current_result: String,
    keypad: Keypad,
}

impl From<(String, Keypad)> for SubSequence {
    fn from((target, keypad): (String, Keypad)) -> Self {
        SubSequence {
            target,
            current_target_char: 0,
            current_result_char: 0,
            current_result: "".to_string(),
            keypad,
        }
    }
}

impl SubSequence {
    fn next_result(&mut self) -> Option<String> {
        let c:char = self.target.as_bytes().get(self.current_target_char)?.to_owned() as char;
        self.current_target_char += 1;
        let s = self.keypad.sequence(c)
            .into_iter()
            .map(char::from)
            .collect();
        Some(s)
    }
    fn new_target(mut self, target: String) -> SubSequence {
        self.target = target;
        self.current_target_char = 0;
        self.current_result = "".to_string();
        self.current_result_char = 0;
        self
    }
    fn new(keypad: Keypad, target: String) -> Self {
        SubSequence {
            target,
            current_target_char: 0,
            current_result_char: 0,
            current_result: "".to_string(),
            keypad,
        }
    }
}

impl Iterator for SubSequence {
    type Item = char;

    fn next(&mut self) -> Option<Self::Item> {
        if self.current_result_char == self.current_result.len() {
            let next_result = self.next_result()?;
            self.current_result = next_result.chars().chain(once('A')).collect();
            self.current_result_char = 0;
            return self.next();
        }
        else {
            let c = self.current_result.as_bytes()[self.current_result_char] as char;
            self.current_result_char += 1;
            Some(c)
        }
    }
}

struct Sequence {
    subs: HashMap<usize, SubSequence>,
    num_directional_subs: usize,
    active_subs: HashSet<usize>,
}

impl Sequence {
    fn next_from_keypad(&mut self, id: usize) -> Option<char> {
        if id == 0 {
            let keypad = self.subs.get(&0).unwrap();
            let target = keypad.target.clone();
            let c = target.as_bytes().get(keypad.current_target_char).map(u8::clone).unwrap_or('-' as u8) as char;
            println!("{target}: {c}");
        }
        self.subs
            .get_mut(&id)
            .unwrap()
            .next()
            .or_else(|| {
                if id == 0 {
                    return None;
                }
                else {
                    let next_target = self.next_from_keypad(id - 1)?.to_string();
                    self.active_subs.insert(id);
                    let next_sub = self.subs.remove(&id)?;
                    self.subs.insert(id, next_sub.new_target(next_target));
                    self.next_from_keypad(id)
                }
            })
    }
    fn new(initial_code: String, num_directional_subs: usize) -> Self {
        let inital_sub = SubSequence::new(Keypad::numeric_keypad(), initial_code);
        let directional_subs = (0..num_directional_subs)
            .map(|_| SubSequence::new(Keypad::directional_keypad(), "".to_string()));
        let active_subs:HashSet<usize> = [0].into_iter().collect();
        let subs = [inital_sub].into_iter()
            .chain(directional_subs.into_iter())
            .enumerate()
            .collect();
        Sequence {
            subs,
            num_directional_subs,
            active_subs,
        }
    }
}

impl Iterator for Sequence {
    type Item = char;

    fn next(&mut self) -> Option<Self::Item> {
        self.next_from_keypad(self.num_directional_subs)
    }
}


impl Keypad {
    fn sequence(&mut self, c: char) -> Vec<OrthoganalDirection> {
        let target_loc = self.buttons
            .get(&c)
            .unwrap()
            .clone();

        let y = self.loc.0.abs_diff(target_loc.0);
        let x = self.loc.1.abs_diff(target_loc.1);
        let y_direction = if self.loc.0 > target_loc.0 { OrthoganalDirection::Up }
            else { OrthoganalDirection::Down };

        let x_direction = if self.loc.1 > target_loc.1 { OrthoganalDirection::Left }
            else { OrthoganalDirection::Right };

        let mut ys = (0..y).map(|_| y_direction).collect_vec();
        let mut xs = (0..x).map(|_| x_direction).collect_vec();
        
        let ys_first = match (x_direction, self.loc.0 == self.danger_row && target_loc.1 == self.danger_col, self.loc.1 == self.danger_col && target_loc.0 == self.danger_row) {
            (_,true, false) => true,
            (_,false, true) => false,
            (OrthoganalDirection::Right, _,_) => true,
            (OrthoganalDirection::Left, _, _) => false,
            _ => panic!("can't determine if ys should be first")
        };
        let combined = if ys_first{ ys.append(&mut xs); ys }
            else { xs.append(&mut ys); xs };

        self.loc = target_loc;
        return combined;

    }

    fn numeric_keypad() -> Keypad {
        let buttons = [
            ('7', (0,0)),
            ('8', (0,1)),
            ('9', (0,2)),
            ('4', (1,0)),
            ('5', (1,1)),
            ('6', (1,2)),
            ('1', (2,0)),
            ('2', (2,1)),
            ('3', (2,2)),
            ('0', (3,1)),
            ('A', (3,2)),
        ].into_iter()
        .collect();

        Keypad {
            buttons,
            loc: (3, 2),
            danger_row: 3,
            danger_col: 0,
        }
    }

    fn directional_keypad() -> Keypad {
        let buttons = [
            ('^', (0,1)),
            ('A', (0,2)),
            ('<', (1,0)),
            ('v', (1,1)),
            ('>', (1,2)),
        ]
        .into_iter()
        .collect();
        Keypad {
            buttons,
            loc: (0,2),
            danger_row: 0,
            danger_col: 0,
        }
    }

    fn secquence(s: &str) -> String {
        let mut door_pad = Keypad::numeric_keypad();
        let mut directional_keypad_1 = Keypad::directional_keypad();
        let mut directional_keypad_2 = Keypad::directional_keypad();


        s.chars()
            .flat_map(|c| {
                door_pad.sequence(c)
                    .into_iter()
                    .map(char::from)
                    .chain(once('A'))
                
            })
            .flat_map(|c| {
                directional_keypad_1.sequence(c)
                    .into_iter()
                    .map(char::from)
                    .chain(once('A'))
            })
            .flat_map(|c| {
                directional_keypad_2.sequence(c)
                    .into_iter()
                    .map(char::from)
                    .chain(once('A'))
            })
            .collect()

    }
}

fn main() {
    let sequences = PRIMARY.lines()
        .map(|code| (code, Keypad::secquence(code)))
        .collect_vec();

    let p1 = sequences.iter()
        .map(|(code, sequence)| {
            let numeric_string: String = code.chars()
                .filter(|c| match c {
                    '0'..='9' => true,
                    _ => false
                }).collect();
            let numeric = numeric_string.parse::<usize>().unwrap();
            numeric * sequence.len()
        })
        .sum::<usize>();

    println!("{p1}");

    let sequences:Vec<(&str, Sequence)> = PRIMARY.lines()
        .map(|code| (code, Sequence::new(code.to_string(), 25)))
        .collect();

        let p2 = sequences.into_par_iter()
        .map(|(code, sequence)| {
            let numeric_string: String = code.chars()
                .filter(|c| match c {
                    '0'..='9' => true,
                    _ => false
                }).collect();
            let numeric = numeric_string.parse::<usize>().unwrap();
            let sequence_len = sequence.count();
            println!("{code}: {sequence_len}");
            numeric * sequence_len
        })
        .sum::<usize>();
    println!("{p2}");
}