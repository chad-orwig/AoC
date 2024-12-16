use core::time;
use std::{collections::{HashMap, HashSet}, fmt::{self, Display, Formatter}, thread};

use itertools::Itertools;
use lib::{inputs::d15::{PRIMARY, TEST}, Direction, FromChar, Loc, OrthoganalDirection, Travel};
use priority_queue::PriorityQueue;

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
enum Thing {
    Wall,
    Box,
    Robot,
    Empty,
}
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
enum Thing2 {
    Wall,
    LBox,
    RBox,
    Robot,
    Empty
}
#[derive(Debug)]
struct ParseThingError;
impl FromChar for Thing {
    type Err = ParseThingError;

    fn from_char(c: char) -> Result<Self, Self::Err> {
        match c {
            '#' => Ok(Thing::Wall),
            'O' => Ok(Thing::Box),
            '@' => Ok(Thing::Robot),
            '.' => Ok(Thing::Empty),
            _ => Err(ParseThingError),
        }
    }
}

impl FromChar for Thing2 {
    type Err = ParseThingError;

    fn from_char(c: char) -> Result<Self, Self::Err> {
        match c {
            '#' => Ok(Thing2::Wall),
            '[' => Ok(Thing2::LBox),
            ']' => Ok(Thing2::RBox),
            '@' => Ok(Thing2::Robot),
            '.' => Ok(Thing2::Empty),
            _ => Err(ParseThingError),
        }
    }
}

impl Default for Thing {
    fn default() -> Self {
        Thing::Empty
    }
}

impl Default for Thing2 {
    fn default() -> Self {
        Thing2::Empty
    }
}

impl Display for Thing {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        let s = match &self {
            Thing::Wall => "#",
            Thing::Box => "O",
            Thing::Robot => "@",
            Thing::Empty => " ",
        };
        write!(f, "{s}")
    }
}

impl Display for Thing2 {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        let s = match &self {
            Thing2::Wall => "#",
            Thing2::LBox => "[",
            Thing2::RBox => "]",
            Thing2::Robot => "@",
            Thing2::Empty => ".",
        };
        write!(f, "{s}")
    }
}

type ThingMap = HashMap<Loc<usize>, Thing>;
type Thing2Map = HashMap<Loc<usize>, Thing2>;
trait Printable {
    fn print(&self);
}

fn slice(map: &mut ThingMap, robot_loc: Loc<usize>, dir: OrthoganalDirection) -> Vec<Thing> {
    let mut res = vec![map.remove(&robot_loc).unwrap()];
    let d = dir.into();
    let mut loc = robot_loc;
    
    loop {
        loc = loc.travel(d).unwrap();
        res.push(map.remove(&loc).unwrap());
        match res.last().unwrap() {
            Thing::Wall | Thing::Empty => break,
            Thing::Box => {},
            _ => panic!()
        }
    }

    return res;
}

fn things_2_move(map: &Thing2Map, mut set: HashSet<Loc<usize>>, loc: Loc<usize>, dir: OrthoganalDirection) -> Option<HashSet<Loc<usize>>> {
    if set.contains(&loc) { return Some(set) }
    let thing = map.get(&loc).unwrap();
    let d = dir.into();
    return match thing {
        Thing2::Empty => Some(set),
        Thing2::Wall => None,
        Thing2::LBox | Thing2::RBox => {
            set.insert(loc);
            match dir {
                OrthoganalDirection::Left | OrthoganalDirection::Right => {
                    things_2_move(map, set, loc.travel(d).unwrap(), dir)
                },
                OrthoganalDirection::Down | OrthoganalDirection::Up => {
                    let pair_direction = if thing == &Thing2::LBox { Direction::Right } else { Direction::Left };
                    let pair_loc = loc.travel(pair_direction).unwrap();
                    things_2_move(map, set, loc.travel(d).unwrap(), dir)
                        .and_then(|new_set| things_2_move(map, new_set, pair_loc, dir))
                }
            }
        }
        Thing2::Robot => {
            set.insert(loc);
            things_2_move(map, set, loc.travel(d).unwrap(), dir)
        },
    };
}

trait PrioritizedBy {
    type PriorityItem;
    type PriorityType: PartialOrd;
    fn prioritize(&self, item: Self::PriorityItem) -> Self::PriorityType;
}

impl PrioritizedBy for Loc<usize> {
    type PriorityItem = OrthoganalDirection;

    type PriorityType = usize;
    
    fn prioritize(&self, item: Self::PriorityItem) -> Self::PriorityType {
        match item {
            OrthoganalDirection::Left => self.1,
            OrthoganalDirection::Right => usize::MAX - self.1,
            OrthoganalDirection::Up => self.0,
            OrthoganalDirection::Down => usize::MAX - self.0,
        }
    }

}

fn move_the_things_2(map: &mut Thing2Map, set: HashSet<Loc<usize>>, dir: OrthoganalDirection) {
    let groups = set.into_iter()
        .map(|(y, x): (usize, usize)| match dir {
            OrthoganalDirection::Down | OrthoganalDirection::Up => (x, (y,x)),
            OrthoganalDirection::Left | OrthoganalDirection::Right => (y, (y,x))
        })
        .fold(HashMap::<usize, PriorityQueue<Loc<usize>, usize>>::new(), |mut map, (k, loc)| {
            let priority = loc.prioritize(dir);
            let queue = map.entry(k).or_default();
            queue.push(loc, priority);
            return map;
        });
    
    let d: Direction = dir.into();

    for queue in groups.into_values() {
        
        let things = queue.into_sorted_iter()
            .map(|(loc,_)|(loc, map.remove(&loc).unwrap()))
            .collect_vec();
        for (loc, thing) in things {
            if !map.contains_key(&loc) { map.insert(loc, Thing2::Empty); }
            map.insert(loc.travel(d).unwrap(), thing);
        }
    }
    
}

impl <T: Display+Default>Printable for HashMap<Loc<usize>, T> {
    fn print(&self) {
        let (max_y, max_x) = self.keys()
            .cloned()
            .reduce(|(curr_y,curr_x), (new_y, new_x)|(curr_y.max(new_y), curr_x.max(new_x)))
            .unwrap();
        for y in 0..=max_y {
            for x in 0..=max_x {
                print!("{}", self.get(&(y,x)).unwrap_or(&T::default()))
            }
            println!();
        }
    }
}

fn execute_command(map: &mut ThingMap, robot_loc: Loc<usize>, dir: OrthoganalDirection, slice: Vec<Thing>) -> Loc<usize> {
    
    let d = dir.into();
    let mut loc_option = Some(robot_loc);
    if let Some(&Thing::Wall) = slice.last() {
        for i in 0..slice.len() {
            let loc = loc_option.unwrap();
            let thing = slice.get(i).unwrap();
            map.insert(loc, *thing);
            loc_option = loc.travel(d);
        }
        return robot_loc;
    }
    else {
        map.insert(robot_loc, Thing::Empty);
        for i in 1..slice.len() {
            loc_option = loc_option.unwrap().travel(d);
            let thing = slice.get(i - 1).unwrap();
            map.insert(loc_option.unwrap(), *thing);
        }
        return robot_loc.travel(d).unwrap();
    }
    
}

fn main() {
    let [map_in, commands_in] = PRIMARY.split("\n\n").collect_vec()[..] else { panic!() };

    let mut p1_map: ThingMap = map_in.lines()
        .enumerate()
        .flat_map(|(y, line)| line.chars()
            .flat_map(Thing::from_char)
            .enumerate()
            .map(move |(x, t)| ((y,x), t))
        ).collect();

    let commands = commands_in.lines()
        .flat_map(str::chars)
        .flat_map(OrthoganalDirection::from_char)
        .collect_vec();
    
    let mut robot_loc = p1_map.iter()
        .find(|(_l, t)| t == &&Thing::Robot)
        .map(|(l,_)|*l)
        .unwrap();

    for dir in commands.clone() {
        let this_slice = slice(&mut p1_map, robot_loc, dir);
        robot_loc = execute_command(&mut p1_map, robot_loc, dir, this_slice);
    }
    p1_map.print();

    let p1 = p1_map.iter()
        .filter(|(_, thing)| thing == &&Thing::Box)
        .map(|(l,_)|l)
        .map(|(y,x)| 100 * y + x)
        .sum::<usize>();
    println!("{p1}");

    let mut p2_map:Thing2Map = map_in.lines()
        .enumerate()
        .flat_map(|(y, line)| line.chars()
            .flat_map(|c| match c {
                '#' => ['#', '#'],
                'O' => ['[',']'],
                '.' => ['.','.'],
                '@' => ['@','.'],
                _ => panic!()
            })
            .flat_map(Thing2::from_char)
            .enumerate()
            .map(move |(x, t)| ((y,x), t))
        ).collect();

    robot_loc = p2_map.iter()
        .find(|(_l, t)| t == &&Thing2::Robot)
        .map(|(l,_)|*l)
        .unwrap();
    p2_map.print();
    for dir in commands {
        let things_2_move_option = things_2_move(&p2_map, HashSet::new(), robot_loc, dir);
        if let Some(things_2_move) = things_2_move_option {
            move_the_things_2(&mut p2_map, things_2_move, dir);
            robot_loc = robot_loc.travel(dir.into()).unwrap();
        }
    }

    p2_map.print();

    let p2 = p2_map.iter()
        .filter(|(_, thing)| thing == &&Thing2::LBox)
        .map(|(l,_)|l)
        .map(|(y,x)| (100 * y) + x)
        .sum::<usize>();
    println!("{p2}");

}