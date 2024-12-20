use std::{cmp::Reverse, collections::{BTreeSet, HashSet}, fmt::{self, Debug, Formatter}, hash::{DefaultHasher, Hash, Hasher}};

use itertools::Itertools;
use lib::{inputs::d16::{PRIMARY, TEST}, search::{search, Searchable}, FromChar, Loc, OrthoganalDirection, RowColumn, Travel};

struct Runner<'a> {
    dir: OrthoganalDirection,
    score: usize,
    loc: Loc<usize>,
    maze: &'a Maze,
    seen: BTreeSet<Loc<usize>>,
}

impl Debug for Runner<'_> {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        f.debug_struct("Runner")
            .field("dir", &self.dir)
            .field("score", &self.score)
            .field("loc", &self.loc)
            .finish()
    }
}

impl Hash for Runner<'_> {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.dir.hash(state);
        self.loc.hash(state);
    }
}

impl PartialEq for Runner<'_> {
    fn eq(&self, other: &Runner) -> bool {
        self.dir == other.dir && self.loc == other.loc
    }
}

impl Eq for Runner<'_> {}

#[derive(Debug)]
struct Maze {
    map: Vec<Vec<Tile>>,
    start: Loc<usize>,
    end: Loc<usize>,
}
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
enum Tile {
    Wall,
    Start,
    End,
    Empty,
}
impl Default for Tile {
    fn default() -> Self {
        Tile::Empty
    }
}
struct ParseTileError;
impl FromChar for Tile {
    type Err = ParseTileError;

    fn from_char(c: char) -> Result<Self, Self::Err> {
        match c {
            '#' => Ok(Tile::Wall),
            'E' => Ok(Tile::End),
            'S' => Ok(Tile::Start),
            '.' => Ok(Tile::Empty),
            _ => Err(ParseTileError),
        }
    }
}

impl <'a> Runner<'a> {
    fn required_turns_penalty(&self) -> usize {
        match self.dir {
            OrthoganalDirection::Left => 1000,
            OrthoganalDirection::Right => 1000,
            OrthoganalDirection::Up => 0,
            OrthoganalDirection::Down => 2000,
        }
    }
    fn turn(&self) -> [Runner<'a>; 2] {
        self.dir.turn()
            .map(|dir|Runner { loc: self.loc.clone(), dir, score: 1000 + self.score, maze: self.maze, seen: self.seen.clone() })
    }
    fn travel(&self) -> Option<Runner<'a>> {
        let loc = self.loc.travel(self.dir.into()).unwrap();
        match self.maze.map.get_rc(loc) {
            Some(Tile::Wall) | None => None,
            _ => {
                let mut seen = self.seen.clone();
                seen.insert(loc);
                Some(Runner { dir: self.dir, score: self.score + 1, loc, maze: self.maze, seen })
            }
        }
    }
    fn travel_all(&self) -> Option<Runner<'a>> {
        let mut prev: Option<Runner<'a>> = None;
        let mut next = self.travel();
        while next.is_some() {
            let r = next.unwrap();
            let turns = self.dir.turn()
                .into_iter()
                .map(OrthoganalDirection::into)
                .flat_map(|d| r.loc.travel(d))
                .flat_map(|l| self.maze.map.get_rc(l))
                .filter(|t| **t != Tile::Wall)
                .next()
                .is_some();
            next = r.travel();
            prev = Some(r);
            if turns { break; }
        }
        prev
    }
 }

impl<'a> Searchable for Runner<'a> {
    type PriorityType=Reverse<usize>;
    
    fn next_states(&self) -> impl Iterator<Item = Runner<'a>> {
        let travel = self.travel_all();
        let turns = self.turn();
        return turns.into_iter()
            .flat_map(|r| r.travel_all())
            .chain(travel)
    }

    fn priority(&self) -> Self::PriorityType {
        Reverse(self.score + self.loc.0.abs_diff(self.maze.end.0) + self.loc.1.abs_diff(self.maze.end.1 + self.required_turns_penalty()))
    }

    fn complete(&self) -> bool {
        self.loc.eq(&self.maze.end)
    }
    
    fn merge(mut self, priority: Self::PriorityType, mut other: Self, other_priority: Self::PriorityType) -> Self {
        match priority.cmp(&other_priority) {
            std::cmp::Ordering::Less => other,
            std::cmp::Ordering::Greater => self,
            std::cmp::Ordering::Equal => {
                self.seen.append(&mut other.seen);
                return self;
            },
        }
    }
}
fn main() {
    let map = PRIMARY.lines()
        .map(|line| line.chars()
            .flat_map(Tile::from_char)
            .collect_vec()
        ).collect_vec();
    let start= map.iter()
        .enumerate()
        .flat_map(|(y, line)| line.iter()
            .enumerate()
            .map(move |(x, t)| (y,x,t))
        )
        .filter(|(_,_,t)| t == &&Tile::Start)
        .map(|(y,x,_)| (y,x))
        .nth(0)
        .unwrap();
    let end= map.iter()
        .enumerate()
        .flat_map(|(y, line)| line.iter()
            .enumerate()
            .map(move |(x, t)| (y,x,t))
        )
        .filter(|(_,_,t)| t == &&Tile::End)
        .map(|(y,x,_)| (y,x))
        .nth(0)
        .unwrap();
    let maze = Maze {
        map,
        start,
        end,
    };
    let init = Runner {
        loc: maze.start,
        dir: OrthoganalDirection::Right,
        score: 0,
        maze: &maze,
        seen: BTreeSet::from_iter([maze.start]),
    };

    let (p1, mut q) = search(vec![init], true).unwrap();
    let score = p1.score;
    println!("{score}");

    let mut winners = vec![p1];

    while let Some((r, _)) = q.pop() {
        if r.score > score { break }
        else if r.complete() { winners.push(r) }
        else {
            for new_item in r.next_states() {
                let priority = new_item.priority();
                q.push(new_item, priority);
                
            }
        }
    }
    let p2 = winners.into_iter()
        .flat_map(|r| r.seen.into_iter())
        .unique()
        .sorted()
        .unique()
        .count();

    println!("{:?}", p2);

}