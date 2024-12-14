use itertools::Itertools;
use lib::{inputs::d10::PRIMARY, Direction, Loc, OrthoganalDirection, RowColumn};
use strum::IntoEnumIterator;

struct PotentialTrail<'a> {
    head: Loc<usize>,
    map: &'a Vec<Vec<u32>>,
}
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Clone, Copy)]
struct Trail {
    head: Loc<usize>,
    score: usize,
    rating: usize,
}

fn steps(trail_map: &Vec<Vec<u32>>, loc: Loc<usize>) -> impl Iterator<Item = Loc<usize>> + use<'_> {
    let current_height = *trail_map.get_rc(loc).unwrap();
    return OrthoganalDirection::iter()
        .flat_map(move |dir| trail_map.next_rc(loc, Direction::from(dir)))
        .filter(move |loc| trail_map.get_rc(*loc)
            .map(|step_height| *step_height == current_height + 1)
            .unwrap_or(false)
        )
}


impl PotentialTrail<'_> {
    fn calc_score(&self) -> (usize, usize) {
        let paths = steps(self.map, self.head)
            .flat_map(|h1| steps(self.map, h1))
            .flat_map(|h2| steps(self.map, h2))
            .flat_map(|h3| steps(self.map, h3))
            .flat_map(|h4| steps(self.map, h4))
            .flat_map(|h5| steps(self.map, h5))
            .flat_map(|h6| steps(self.map, h6))
            .flat_map(|h7| steps(self.map, h7))
            .flat_map(|h8| steps(self.map, h8))
            .collect_vec();
        let rating = paths.iter().count();
        let score = paths.iter().unique().count();
        return (rating, score)
        
    }
    fn into_trail(self) -> Option<Trail> {
        let (rating, score) = self.calc_score();
        return match score {
            0 => None,
            _ => Some(Trail{ score, head: self.head, rating })
        }
    }
}


fn main() {
    let trail_map = PRIMARY.lines()
        .map(|line| line.chars()
            .flat_map(|c| c.to_digit(10))
            .collect_vec()
        ).collect_vec();

    let trails = trail_map.iter()
        .enumerate()
        .flat_map(|(row_i, row)| row.iter()
            .enumerate()
            .filter(|(_,height)| height == &&0)
            .map(move |(col_i, _)| (row_i, col_i))
        )
        .map(|head| PotentialTrail{ head, map: &trail_map })
        .flat_map(PotentialTrail::into_trail)
        .collect_vec();

    let p1: usize = trails.iter().map(|t| t.score).sum();

    println!("{}", p1);

    let p2: usize = trails.iter().map(|t| t.rating).sum();

    println!("{}", p2);
}