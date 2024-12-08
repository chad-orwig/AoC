use std::{collections::HashSet, str::FromStr};

use itertools::Itertools;
use lib::{inputs::d6::PRIMARY, search_vec_of_vecs, Direction, OrthoganalDirection, RowColumn};
use rayon::iter::{IntoParallelIterator, ParallelIterator};


#[derive(PartialEq, Clone)]
enum Space {
    Empty,
    Obstruction,
    Guard(OrthoganalDirection),
}
struct ParseSpaceError;

#[derive(Clone, Copy, PartialEq, Eq, Hash)]
struct GuardInfo((usize,usize), OrthoganalDirection);

impl FromStr for Space {
    type Err = ParseSpaceError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        if s.len() != 1 { return Err(ParseSpaceError)}

        match s {
            "#" => Ok(Space::Obstruction),
            "." => Ok(Space::Empty),
            "^" => Ok(Space::Guard(OrthoganalDirection::Up)),
            ">" => Ok(Self::Guard(OrthoganalDirection::Right)),
            "v" => Ok(Self::Guard(OrthoganalDirection::Down)),
            "<" => Ok(Self::Guard(OrthoganalDirection::Left)),
            _ => Err(ParseSpaceError)
        }
    }
}

fn turn (dir: OrthoganalDirection) -> OrthoganalDirection {
    match dir {
        OrthoganalDirection::Down => OrthoganalDirection::Left,
        OrthoganalDirection::Left => OrthoganalDirection::Up,
        OrthoganalDirection::Right => OrthoganalDirection::Down,
        OrthoganalDirection::Up => OrthoganalDirection::Right,
        
    }
}

fn guard_move(map: &Vec<Vec<Space>>, GuardInfo(guard_loc, guard_dir): GuardInfo) -> Option<GuardInfo> {

    let next_loc = map.next_rc(guard_loc, Direction::from(guard_dir));

    return next_loc
        .and_then(|loc| map.get_rc(loc)
            .map(|space|(loc, space))
        )
        .map(|(loc, space)| {
            match space {
                Space::Empty => GuardInfo(loc, guard_dir.clone()),
                Space::Obstruction => GuardInfo(guard_loc.clone(), turn(guard_dir)),
                _ => panic!("There's a guard in front of a guard"),
            }
        })
}

fn obstruction_creates_loop(initial_map: &Vec<Vec<Space>>, loc: (usize, usize), initial_guard_info: &GuardInfo) -> bool {
    let mut map = (*initial_map).clone();
    map[loc.0][loc.1] = Space::Obstruction;
    let mut seen: HashSet<GuardInfo> = HashSet::new();
    let mut guard_info_option = Some((*initial_guard_info).clone());
    while let Some(guard_info) = guard_info_option {
        let GuardInfo(loc, _dir) = guard_info;
        map[loc.0][loc.1] = Space::Empty;
        if seen.contains(&guard_info) { return true; }
        seen.insert(guard_info);
        guard_info_option = guard_move(&map, guard_info);
        let new_info = guard_info_option.unwrap_or(guard_info);
        map[new_info.0.0][new_info.0.1] = Space::Guard(new_info.1);
        
    }
    return false;
}

fn main() {
    let initial_map = PRIMARY.lines()
        .map(|line| line.split("")
            .flat_map(str::parse::<Space>)
            .collect_vec()
        ).collect_vec();
    let mut p1_map = initial_map.clone();
    let mut seen: HashSet<(usize, usize)> = HashSet::new();
    let initial_guard_info = Some(OrthoganalDirection::Up)
        .and_then(|dir|search_vec_of_vecs(&p1_map, &Space::Guard(dir)).map(|loc| GuardInfo(loc, dir)))
        .unwrap();
    let mut guard_info_option = Some(initial_guard_info.clone());
    while let Some(GuardInfo(loc, dir)) = guard_info_option {
        p1_map[loc.0][loc.1] = Space::Empty;
        seen.insert(loc.clone());
        guard_info_option = guard_move(&p1_map, GuardInfo(loc, dir));
        let new_info = guard_info_option.unwrap_or(GuardInfo(loc, dir));
        p1_map[new_info.0.0][new_info.0.1] = Space::Guard(new_info.1);
        
    }
    println!("{}", seen.len());

    let p2 = seen.into_par_iter()
        .filter(|loc| !loc.eq(&&initial_guard_info.0))
        .filter(|loc| obstruction_creates_loop(&initial_map, *loc, &initial_guard_info))
        .count();

        println!("{:?}", p2);
}