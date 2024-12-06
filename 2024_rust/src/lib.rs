use strum_macros::EnumIter;

pub mod inputs;

#[derive(Debug, EnumIter, Clone, Copy)]
pub enum Direction {
    Left,
    Right,
    Up,
    Down,
    UpLeft,
    UpRight,
    DownLeft,
    DownRight,
}

pub trait RowColumn {
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