use std::{cmp::Reverse, fmt::{self, Debug, Formatter}, hash::{Hash, Hasher}};

use itertools::Itertools;
use lib::{inputs::d16::{PRIMARY, TEST}, search::{search, Searchable}, FromChar, Loc, OrthoganalDirection, RowColumn, Travel};

struct Runner<'a> {
    dir: OrthoganalDirection,
    score: usize,
    loc: Loc<usize>,
    maze: &'a Maze,
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
        self.score.hash(state);
    }
}

impl PartialEq for Runner<'_> {
    fn eq(&self, other: &Runner) -> bool {
        self.dir == other.dir && self.loc == other.loc && self.score == other.score
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
    fn turn(&self) -> [Runner<'a>; 2] {
        match self.dir {
            OrthoganalDirection::Left | OrthoganalDirection::Right => [
                Runner { loc: self.loc.clone(), dir: OrthoganalDirection::Down, score: 1000 + self.score, maze: self.maze },
                Runner { loc: self.loc.clone(), dir: OrthoganalDirection::Up, score: 1000 + self.score, maze: self.maze }
            ],
            OrthoganalDirection::Up | OrthoganalDirection::Down => [
                Runner { loc: self.loc.clone(), dir: OrthoganalDirection::Left, score: 1000 + self.score, maze: self.maze },
                Runner { loc: self.loc.clone(), dir: OrthoganalDirection::Right, score: 1000 + self.score, maze: self.maze }
            ],
        }
    }
    fn travel(&self) -> Option<Runner<'a>> {
        let loc = self.loc.travel(self.dir.into()).unwrap();
        match self.maze.map.get_rc(loc) {
            Some(Tile::Wall) | None => None,
            _ => {
                Some(Runner { dir: self.dir, score: self.score + 1, loc, maze: self.maze })
            }
        }
        
    }
 }

impl<'a> Searchable for Runner<'a> {
    type PriorityType=Reverse<usize>;
    type KeyType=(Loc<usize>, OrthoganalDirection);

    fn next_states(&self) -> impl Iterator<Item = Runner<'a>> {
        let travel = self.travel();
        let [turn1, turn2] = self.turn();
        [travel, Some(turn1), Some(turn2)].into_iter().flatten()
    }

    fn priority(&self) -> Self::PriorityType {
        Reverse(self.score + self.loc.0.abs_diff(self.maze.end.0) + self.loc.1.abs_diff(self.maze.end.1))
    }

    fn complete(&self) -> bool {
        self.loc.eq(&self.maze.end)
    }
    
    
    fn key(&self) -> Self::KeyType {
        (self.loc, self.dir)
    }
}
fn main() {
    let map = TEST.lines()
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
    };

    let (p1, _, _) = search(vec![init]).unwrap();
    let score = p1.score;
    println!("{score}");

}