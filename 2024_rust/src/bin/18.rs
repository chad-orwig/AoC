use std::{cmp::Reverse, collections::HashMap, fmt::{self, Debug}, hash::{Hash, Hasher}};

use itertools::Itertools;
use lib::{inputs::d18::PRIMARY, search::{default_merge, search, Searchable}, Loc, OrthoganalDirection, Travel};
use strum::IntoEnumIterator;

struct Step<'a> {
    loc: Loc<usize>,
    steps: usize,
    size: usize,
    incoming_bytes: &'a HashMap<Loc<usize>, usize>
}
impl Debug for Step<'_> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("Step").field("loc", &self.loc).field("steps", &self.steps).field("size", &self.size).finish()
    }
}
impl PartialEq for Step<'_> {
    fn eq(&self, other: &Step) -> bool {
        self.loc == other.loc
    }
}
impl Eq for Step<'_> {}
impl Hash for Step<'_> {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.loc.hash(state);
    }
}

impl<'a> Step<'a> {

    fn travel(&self, dir: lib::Direction) -> Option<Step<'a>> {
        self.loc.travel(dir)
            .filter(|(y,x)| y <= &self.size && x <= &self.size )
            .map(|l|self.from_loc(l))
            .filter(Step::is_safe)
    }
    fn from_loc(&self, loc: Loc<usize>) -> Step<'a> {
        Step {
            loc,
            steps: self.steps + 1,
            size: self.size,
            incoming_bytes: self.incoming_bytes,
        }
    }
    fn is_safe(&self) -> bool {
        self.incoming_bytes
            .get(&self.loc)
            .filter(|second| second < &&self.steps)
            .is_none()
    }
}

impl <'a> Searchable for Step<'a> {
    type PriorityType = Reverse<usize>;

    fn next_states(&self) -> impl Iterator<Item = Step<'a>> {
        OrthoganalDirection::iter()
            .map(OrthoganalDirection::into)
            .flat_map(|d|self.travel(d))
    }

    fn priority(&self) -> Self::PriorityType {
        let (y,x) = self.loc;
        Reverse(self.steps + y.abs_diff(self.size - 1) + x.abs_diff(self.size))
    }

    fn complete(&self) -> bool {
        self.loc == (self.size, self.size)
    }

    fn merge(self, priority: Self::PriorityType, other: Self, other_priority: Self::PriorityType) -> Self {
        default_merge(self, priority, other, other_priority)
    }
}

fn main() {
    let p1_bytes: HashMap<Loc<usize>, usize> = PRIMARY.lines()
        .take(1024)
    .map(|line| line.split(",")
            .flat_map(|s|s.parse::<usize>())
            .collect_tuple()
            .unwrap()
        ).map(|(x,y)|((y,x),0))
        .collect();
    let step = Step {
        loc: (0,0),
        steps: 0,
        size: 70,
        incoming_bytes: &p1_bytes,
    };


    let search_result = search(vec![step], false).unwrap();

    println!("{}", search_result.0.steps);

    let mut count = 1025;
    loop {
        let p1_bytes: HashMap<Loc<usize>, usize> = PRIMARY.lines()
            .take(count)
            .map(|line| line.split(",")
                .flat_map(|s|s.parse::<usize>())
                .collect_tuple()
                .unwrap()
            ).map(|(x,y)|((y,x),0))
            .collect();
        let step = Step {
            loc: (0,0),
            steps: 0,
            size: 70,
            incoming_bytes: &p1_bytes,
        };

        let search_result = search(vec![step], false);
        if search_result.is_none() { break; }
        else { count += 1 }
    }

    println!("{count}");
}