use itertools::{iproduct, Itertools};
use lib::{inputs::d4::PRIMARY, Direction, RowColumn};
use strum::IntoEnumIterator;

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