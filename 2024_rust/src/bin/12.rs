use std::{collections::{BTreeSet, HashMap, HashSet}, str::FromStr};

use itertools::Itertools;
use lib::{inputs::d12::PRIMARY, Direction, Loc, OrthoganalDirection, RowColumn, Travel};

type Region = Vec<Plot>;

struct GardenMap {
    raw: Vec<Vec<char>>,
    regions: HashMap<char,Vec<Region>>,
}

#[derive(Clone, Hash, PartialEq, Eq)]
struct Plot {
    loc: Loc,
    neighbors: Vec<OrthoganalDirection>,
}

impl Plot {
    fn is_neighbor(&self, loc: &Loc) -> Option<OrthoganalDirection> {
        match (self.loc.0 as isize - loc.0 as isize, self.loc.1 as isize - loc.1 as isize) {
            (1,0) => Some(OrthoganalDirection::Down),
            (-1, 0) => Some(OrthoganalDirection::Up),
            (0, 1) => Some(OrthoganalDirection::Left),
            (0, -1) => Some(OrthoganalDirection::Right),
            _ => None
        }
    }
    fn new(loc: Loc) -> Plot {
        return Plot {
            loc,
            neighbors: Vec::new(),
        }
    }
}
trait Joinable {
    type Item;
    fn can_join(&self, item: &Self::Item) -> bool;
}

impl Joinable for Region {
    type Item=Plot;

    fn can_join(&self, item: &Self::Item) -> bool {
        return self.iter()
            .any(|p| p.is_neighbor(&item.loc).is_some())
    }
}
trait Compressable<T> {
    fn compress(self) -> T;
}
impl Compressable<Region> for Vec<Region> {
    fn compress(self) -> Region {
        return self.into_iter()
            .flatten()
            .collect_vec();
    }
}

impl GardenMap {
    fn place_plot(&mut self, loc: Loc) {
        let plant_type = self.raw.get_rc(loc).unwrap();
        let plot = Plot::new(loc);
        let regions_for_plant = self.regions.remove(plant_type).unwrap_or(Vec::new());
        let [mut matches, mut not_matches] = regions_for_plant.into_iter()
            .fold([Vec::<Region>::new(), Vec::<Region>::new()], |[mut matches, mut not_matches], r| {
                if r.can_join(&plot) { matches.push(r) }
                else { not_matches.push(r) }
                return [matches, not_matches];
            });

        let compressed = if matches.len() > 0 {
            matches[0].push(plot);
            matches.compress()
        } else {
            vec![plot]
        };
        not_matches.push(compressed);
        self.regions.insert(*plant_type, not_matches);

    }
}

trait AreaAndPerim {
    fn area(&self) -> usize;
    fn perimeter(&self) -> usize;
    fn num_sides_dir(&self, d: OrthoganalDirection) -> usize;
    fn num_sides(&self) -> usize {
        return self.num_sides_dir(OrthoganalDirection::Up)
            + self.num_sides_dir(OrthoganalDirection::Down)
            + self.num_sides_dir(OrthoganalDirection::Left)
            + self.num_sides_dir(OrthoganalDirection::Right)
    }
}

fn remove_related(locs: &mut BTreeSet<&Loc>, loc: &Loc, dir: Direction) {
    let next = loc.travel(dir).filter(|l| locs.remove(l));
    if let Some(l) = next {
        remove_related(locs, &l, dir);
    }
}

impl AreaAndPerim for Region {
    fn area(&self) -> usize {
        return self.len();
    }

    fn perimeter(&self) -> usize {
        return self.iter()
            .map(|p| 4 - p.neighbors.len())
            .sum();
    }
    
    fn num_sides_dir(&self, dir: OrthoganalDirection) -> usize {
        let mut side_locs: BTreeSet<&Loc> = self.iter()
            .filter(|p| !p.neighbors.contains(&dir))
            .map(|p| &p.loc)
            .collect();
        let (d1, d2) = match dir {
            OrthoganalDirection::Down | OrthoganalDirection::Up => (OrthoganalDirection::Left, OrthoganalDirection::Right),
            OrthoganalDirection::Left | OrthoganalDirection::Right=> (OrthoganalDirection::Down, OrthoganalDirection::Up),
        };
        let mut loc_option = side_locs.pop_first();
        let mut count: usize = 0;
        while let Some(loc) = loc_option {
            remove_related(&mut side_locs, loc, d1.into());
            remove_related(&mut side_locs, loc, d2.into());
            loc_option = side_locs.pop_first();
            count += 1;
        }
        return count;
    }
}

#[derive(Debug)]
struct ParseGardenMapErr;
impl FromStr for GardenMap {
    type Err = ParseGardenMapErr;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let raw = s.lines()
            .map(|line| line.chars()
                .collect_vec()
            ).collect_vec();

        let mut res = GardenMap {
            raw,
            regions: HashMap::new()
        };
        for row in 0..res.raw.len() {
            for col in 0..res.raw[0].len() {
                res.place_plot((row, col));
            }
        }
        let keys = res.regions.keys().cloned().collect_vec();
        for c in keys {
            let num_regions = res.regions[&c].len();
            for i in 0..num_regions {
                let num_plots = res.regions[&c][i].len();
                for j in 0..num_plots {
                    let region = res.regions.get_mut(&c).unwrap().get_mut(i).unwrap();
                    region.swap(j, num_plots - 1);
                    let mut plot = region.pop().unwrap();

                    plot.neighbors = res.regions[&c][i].iter()
                        .map(|p| p.loc)
                        .flat_map(|l|plot.is_neighbor(&l))
                        .collect_vec();
                    let region = res.regions.get_mut(&c).unwrap().get_mut(i).unwrap();
                    region.push(plot);
                    region.swap(j, num_plots - 1);
                }
            }
        }
        return Ok(res);
    }
}
fn main() {
    let garden_map = GardenMap::from_str(PRIMARY).unwrap();
    let p1 = garden_map.regions.values()
        .flatten()
        .map(|region| region.perimeter() * region.area())
        .sum::<usize>();
    println!("{p1}");

    let p2 = garden_map.regions.values()
        .flatten()
        .map(|region| region.num_sides() * region.area())
        .sum::<usize>();

    println!("{p2}");
}