use std::{cmp::Reverse, collections::{HashMap, HashSet}, fmt::{self, Debug, Display}, hash::{Hash, Hasher}, str::FromStr};

use itertools::Itertools;
use lib::{inputs::d20::{PRIMARY, TEST}, search::{search, Searchable}, Distance, FindLoc, FromChar, Loc, OrthoganalDirection, RowColumn, Travel};
use rayon::iter::{IntoParallelIterator, IntoParallelRefIterator, ParallelBridge, ParallelIterator};
use strum::IntoEnumIterator;

#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Hash, Debug)]
struct Cheat {
    start: Loc<usize>,
    end: Loc<usize>
}
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Hash, Debug)]
struct CheatWithDistance {
    cheat: Cheat,
    distance: usize,
}

impl From<Cheat> for CheatWithDistance {
    fn from(cheat: Cheat) -> Self {
        let distance = cheat.start.distance(&cheat.end);
        CheatWithDistance {
            cheat,
            distance,
        }
    }
}

struct Position<'a> {
    loc: Loc<usize>,
    time: usize,
    race: &'a Race
}
impl PartialEq for Position<'_> {
    fn eq(&self, other: &Position) -> bool {
        self.loc == other.loc
    }
}
impl Eq for Position<'_> {}
impl <'a> Hash for Position<'a> {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.loc.hash(state);
    }
}
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
enum Tile {
    Wall,
    Empty,
    Start,
    End,
}

impl FromChar for Tile {
    type Err = ParseRaceErr;

    fn from_char(c: char) -> Result<Self, Self::Err> {
        match c {
            '#' => Ok(Tile::Wall),
            'S' => Ok(Tile::Start),
            'E' => Ok(Tile::End),
            '.' => Ok(Tile::Empty),
            _ => Err(ParseRaceErr),
        }
    }
}
impl Display for Tile {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Tile::Wall => write!(f, "#"),
            Tile::Empty => write!(f,"."),
            Tile::Start => write!(f, "S"),
            Tile::End => write!(f,"E"),
        }
    }
}
impl Default for Tile {
    fn default() -> Self {
        Tile::Empty
    }
}
struct Race {
    map: Vec<Vec<Tile>>,
    start: Loc<usize>,
    end: Loc<usize>,
}
#[derive(Debug)]
struct ParseRaceErr;
impl FromStr for Race {
    type Err = ParseRaceErr;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let map = s.lines()
            .map(|line| line.chars()
                .flat_map(Tile::from_char)
                .collect_vec()
            ).collect_vec();
        let start = map.find_loc(&Tile::Start)
            .ok_or(ParseRaceErr)?;
        let end = map.find_loc(&Tile::End)
            .ok_or(ParseRaceErr)?;
        Ok(Race { map, start, end })
    }
}

impl <'a> Searchable for Position<'a> {
    type PriorityType = Reverse<usize>;

    fn next_states(&self) -> impl Iterator<Item = Self> {
        OrthoganalDirection::iter()
            .map(OrthoganalDirection::into)
            .flat_map(|d| self.loc.travel(d))
            .filter(|l| self.race.map.get_rc(*l)
                .filter(|t| t != && Tile::Wall)
                .is_some())
            .map(|loc| Position {
                loc,
                time: self.time + 1,
                race: self.race,
            })
    }

    fn priority(&self) -> Self::PriorityType {
        Reverse(self.time + self.loc.distance(&self.race.end))
    }

    fn complete(&self) -> bool {
        self.loc == self.race.end
    }

    fn merge(self, other: Self) -> Self {
        if self.time > other.time {
            other
        } else { self }
    }
}

impl Debug for Position<'_> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("Position").field("loc", &self.loc).field("time", &self.time).finish()
    }
}
fn locs_within_distance(loc: &Loc<usize>, distance: usize) -> HashSet<Loc<usize>> {
    (0..=distance)
        .flat_map(|y| (0..=(distance - y)).map(move |x|(y,x)))
        .flat_map(|(dy, dx) | {
            let y1 = loc.0.checked_sub(dy);
            let y2 = loc.0.checked_add(dy);
            let x1 = loc.1.checked_sub(dx);
            let x2 = loc.1.checked_add(dx);
            [(y1, x1), (y1, x2), (y2, x1), (y2, x2)]
        })
        .flat_map(|(oy, ox)| {
            let y = oy?;
            let x = ox?;
            Some((y,x))
        })
        .filter(|l| l != loc)
        .collect()
}

fn build_cheats(race: &Race, distance: usize) -> HashSet<CheatWithDistance> {
    race.map.iter_loc()
        .collect_vec()
        .into_par_iter()
        .filter(|(_l, t)| t != && Tile::Wall)
        .flat_map(|(start, _)| locs_within_distance(&start, distance)
            .into_par_iter()
            .map(move |end| Cheat {
                start,
                end,
            })
        ).filter(|c| race.map.get_rc(c.end).filter(|t| t != &&Tile::Wall).is_some())
        .map(CheatWithDistance::from)
        .filter(|c| c.distance > 1)
        .collect()
}

fn calc_time_with_cheat(cheat: &CheatWithDistance, times_to_end: &HashMap<Loc<usize>, usize>, times_from_start:  &HashMap<Loc<usize>, usize>) -> usize {
    let start = times_from_start.get(&cheat.cheat.start).unwrap();
    let end = times_to_end.get(&cheat.cheat.end).unwrap();
    start + end + &cheat.distance
}
impl Race {
    fn reversed(&self) -> Option<Race> {
        let start = self.end.clone();
        let end = self.start.clone();
        let mut map = self.map.clone();
        let row = map.get_mut(end.0)?;
        row[end.1] = Tile::End;

        let row = map.get_mut(start.0)?;
        row[start.1] = Tile::Start;
        Some(Race {
            map,
            start,
            end,
        })
    }
}
fn main() {
    let race = Race::from_str(PRIMARY).unwrap();
    let start_pos = Position {
        loc: race.start.clone(),
        time: 0,
        race: &race,
    };

    let Some((fastest, _, _)) = search(vec![start_pos],false) else { panic!()};

    println!("Fastest: {}", fastest.time);

    let times_to_end: HashMap<Loc<usize>, usize> = race.map.iter_loc()
        .collect_vec()
        .into_par_iter()
        .filter(|(_l, t)| t != &&Tile::Wall)
        .map(|(loc,_t)| Position {
            loc,
            time: 0,
            race: &race,
        })
        .flat_map(|p| {
            let loc = p.loc.clone();
            let (result, _, _) = search(vec![p], false)?;
            Some((loc, result.time))
        })
        .collect();
    let reversed_race = race.reversed().unwrap();
    let times_from_start: HashMap<Loc<usize>, usize> = race.map.iter_loc()
        .collect_vec()
        .into_par_iter()
        .filter(|(_l, t)| t != &&Tile::Wall)
        .map(|(loc,_t)| Position {
            loc,
            time: 0,
            race: &reversed_race,
        })
        .flat_map(|p| {
            let loc = p.loc.clone();
            let (result, _, _) = search(vec![p], false)?;
            Some((loc, result.time))
        })
        .collect();
    
    let cheat_2s = build_cheats(&race, 2);
    let p1 = cheat_2s.into_iter()
        .map(|c| (calc_time_with_cheat(&c, &times_to_end, &times_from_start), c))
        .sorted()
        .flat_map(|(t, c)|fastest.time.checked_sub(t).map(|saved| (saved, c)))
        .filter(|(t, _)| *t >= 100)
        .count();
    println!("{:?}", p1);

    let cheat_20s = build_cheats(&race, 20);
    let p2 = cheat_20s.into_iter()
        .map(|c| (calc_time_with_cheat(&c, &times_to_end, &times_from_start), c))
        .sorted()
        .flat_map(|(t, c)|fastest.time.checked_sub(t).map(|saved| (saved, c)))
        .filter(|(t, _)| *t >= 100)
        .count();
    println!("{p2}");
}