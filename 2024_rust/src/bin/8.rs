use std::collections::HashMap;

use itertools::{iproduct, Itertools};
use lib::{inputs::d8::PRIMARY, FromChar, Loc, RowColumn};

#[derive(Debug, PartialEq, Eq, Clone, Copy, Hash)]
enum Space {
    Empty,
    Frequency(char),
}
struct ParseSpaceError;
impl FromChar for Space {
    type Err = ParseSpaceError;

    fn from_char(c: char) -> Result<Self, Self::Err> {
        match c {
            '.' => Ok(Space::Empty),
            '0'..='9' | 'A'..='Z' | 'a'..='z' => Ok(Space::Frequency(c)),
            _ => Err(ParseSpaceError),
        }
    }
}

struct AntinodeIter<'a> {
    curr: (i64, i64),
    map: &'a Vec<Vec<Space>>,
    diff: (i64, i64),
}

impl Iterator for AntinodeIter<'_> {
    type Item = Loc;

    fn next(&mut self) -> Option<Self::Item> {
        let next = (self.curr.0 + self.diff.0, self.curr.1 + self.diff.1);

        let res = usize::try_from(self.curr.0)
            .and_then(|row| usize::try_from(self.curr.1)
            .map(|col| (row, col))    
        )
        .ok()
        .and_then(|loc| self.map.if_exists(loc, loc));
        self.curr = next;
        return res;
        
    }
}

impl <'a> AntinodeIter<'a> {
    pub fn new(start: Loc, pair: Loc, map: &'a Vec<Vec<Space>>) -> Self {
        let signed_1= (i64::try_from(start.0).unwrap(), i64::try_from(start.1).unwrap());
        let signed_2= (i64::try_from(pair.0).unwrap(), i64::try_from(pair.1).unwrap());

        let diff = (signed_1.0 - signed_2.0, signed_1.1 - signed_2.1);

        return Self {
            curr: signed_1,
            map,
            diff,
        };
    }
}


fn all_antinodes<'a>(left: Loc, right: Loc, map: &'a Vec<Vec<Space>>) -> impl Iterator<Item = Loc> + use<'a> {
    return AntinodeIter::new(left, right, map)
        .chain(AntinodeIter::new(right, left, map))
}

fn first_antinode(loc_1: Loc, loc_2: Loc) -> Vec<Option<Loc>>{
    let signed_1= (i64::try_from(loc_1.0).unwrap(), i64::try_from(loc_1.1).unwrap());
    let signed_2= (i64::try_from(loc_2.0).unwrap(), i64::try_from(loc_2.1).unwrap());

    let diff = (signed_1.0 - signed_2.0, signed_1.1 - signed_2.1);

    let a1 = usize::try_from(signed_1.0 + diff.0)
        .and_then(|row| usize::try_from(signed_1.1 + diff.1)
            .map(|col| (row, col))    
        ).ok();

    let a2 = usize::try_from(signed_2.0 - diff.0)
        .and_then(|row| usize::try_from(signed_2.1 - diff.1)
            .map(|col| (row, col))    
        ).ok();

    return vec![a1, a2];
}

fn all_first_antinodes(frequencies: &Vec<Loc>) -> impl Iterator<Item=Option<Loc>> {
    return iproduct!(frequencies.clone(), frequencies.clone())
        .filter(|(left, right)| left != right)
        .flat_map(|(left, right)| first_antinode(left, right).into_iter())

}

fn all_all_antinodes<'a>(frequencies: &Vec<Loc>, map: &'a Vec<Vec<Space>>) -> impl Iterator<Item=Loc> + use<'a> {
    return iproduct!(frequencies.clone(), frequencies.clone())
        .filter(|(left, right)| left != right)
        .flat_map(|(left, right)| all_antinodes(left, right, map));
}

fn main() {
    let map = PRIMARY.split("\n")
        .map(|line| line.chars()
            .flat_map(Space::from_char)
            .collect_vec()
        )
        .collect_vec();

    let frequency_locs = map.iter_loc()
        .fold(HashMap::new(), |mut h_map: HashMap<Space, Vec<Loc>>, (loc, space): (Loc, &Space) | match space {
            Space::Empty => h_map,
            Space::Frequency(_) => {
                h_map.entry(*space).or_default().push(loc);
                return h_map;
            },
        });

    let p1 = frequency_locs.values()
        .flat_map(all_first_antinodes)
        .flatten()
        .flat_map(|loc| map.if_exists(loc, loc))
        .unique()
        .count();

    println!("{}", p1);

    let p2 = frequency_locs.values()
        .flat_map(|v| all_all_antinodes(v, &map))
        .unique()
        .count();

        println!("{}", p2);
    
}