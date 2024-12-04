use itertools::{iproduct, Itertools};
use lib::inputs::d4::PRIMARY;
use strum::IntoEnumIterator;
use strum_macros::EnumIter;

#[derive(Debug, EnumIter, Clone, Copy)]
enum Direction {
    Left,
    Right,
    Up,
    Down,
    UpLeft,
    UpRight,
    DownLeft,
    DownRight,
}

trait RowColumn {
    type Item:PartialEq;
    fn get_rc(&self, loc:(usize, usize)) -> Option<&Self::Item>;
    fn matches(&self, loc:(usize, usize), item:&Self::Item) -> bool {
        return self.get_rc(loc).map(|i| i == item).unwrap_or(false);
    }
    fn next_rc(&self, loc:(usize, usize), dir: Direction) -> Option<(usize, usize)>;
    fn get_next_rc(&self, loc:(usize, usize), dir: Direction) -> Option<&Self::Item> {
        return self.next_rc(loc, dir)
            .and_then(|next_loc| self.get_rc(next_loc));
    }
}

impl <T:PartialEq> RowColumn for Vec<Vec<T>> {
    type Item = T;
    
    fn get_rc(&self, (row, column): (usize, usize)) -> Option<&Self::Item> {
        return self.get(row)?.get(column);
    }
    
    fn next_rc(&self, (row, col):(usize, usize), dir: Direction) -> Option<(usize, usize)> {
        return match dir {
            Direction::Left => Some(col)
                .filter(|c| *c > 0)
                .map(|c| (row, c - 1)),
            Direction::Right => Some((row, col + 1)),
            Direction::Up => Some(row)
                .filter(|r|*r > 0)
                .map(|r|(r - 1, col)),
            Direction::Down => Some((row + 1, col)),
            Direction::UpLeft => Some((row, col))
                .filter(|(r, _c)|*r > 0)
                .filter(|(_r, c)| *c > 0)
                .map(|(r,c)| (r - 1, c - 1)),
            Direction::UpRight => Some(row)
                .filter(|r|*r > 0)
                .map(|r|(r - 1, col + 1)),
            Direction::DownLeft => Some(col)
                .filter(|c| *c > 0)
                .map(|c| (row + 1, c - 1)),
            Direction::DownRight => Some((row + 1, col + 1)),
        }
    }
}

fn is_x_mas(chars:&Vec<Vec<char>>, a_loc: (usize, usize)) -> bool {
    return chars.get_next_rc(a_loc, Direction::UpLeft)
        .filter(|up_left| up_left == &&'M' || up_left == &&'S')
        .and_then(|up_left| match up_left {
            'S' => chars.get_next_rc(a_loc, Direction::DownRight).filter(|down_right| down_right == &&'M'),
            'M' => chars.get_next_rc(a_loc, Direction::DownRight).filter(|down_right| down_right == &&'S'),
            _woops => None
        })
        .and(chars.get_next_rc(a_loc, Direction::UpRight))
        .filter(|up_right| up_right == &&'M' || up_right == &&'S')
        .and_then(|up_right| match up_right {
            'S' => chars.get_next_rc(a_loc, Direction::DownLeft).filter(|down_left| down_left == &&'M'),
            'M' => chars.get_next_rc(a_loc, Direction::DownLeft).filter(|down_left| down_left == &&'S'),
            _woops => None
        })
        .map(|_|true)
        .unwrap_or(false);
}

pub fn main() {
    let input = PRIMARY
        .split("\n")
        .map(|line| line.chars().collect_vec())
        .collect_vec();
    
    let xs = input.iter()
        .enumerate()
        .flat_map(|(row, line)| line
            .iter()
            .enumerate()
            .filter(|(_col, c)| **c == 'X')
            .map(move |(col, _x)| (row, col))
        )
        .collect_vec();

    let p1 = iproduct!(Direction::iter().collect_vec(), xs)
        .map(|(dir, x_loc)| input.next_rc(x_loc, dir)
            .map(|next|(dir, next)
        ))
        .flatten()
        .filter(|(_dir, m_loc)| input.matches(*m_loc, &'M'))
        .map(|(dir, m_loc)| input.next_rc(m_loc, dir)
            .map(|next|(dir, next)
        ))
        .flatten()
        .filter(|(_dir, a_loc)| input.matches(*a_loc, &'A'))
        .map(|(dir, a_loc)| input.next_rc(a_loc, dir)
            .map(|next|(dir, next)
        ))
        .flatten()
        .filter(|(_dir, s_loc)| input.matches(*s_loc, &'S'))
        .count();

    println!("{}", p1);

    let a_s = input.iter()
        .enumerate()
        .flat_map(|(row, line)| line
            .iter()
            .enumerate()
            .filter(|(_col, c)| **c == 'A')
            .map(move |(col, _x)| (row, col))
        )
        .collect_vec();
    let p2 = a_s.iter()
        .filter(|loc| is_x_mas(&input, **loc))
        .count();
    println!("{}", p2);
}