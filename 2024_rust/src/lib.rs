use strum_macros::EnumIter;
use subenum::subenum;

pub mod inputs;

pub type Loc = (usize, usize);

#[subenum(OrthoganalDirection)]
#[derive(Debug, EnumIter, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Direction {
    #[subenum(OrthoganalDirection)]
    Left,
    #[subenum(OrthoganalDirection)]
    Right,
    #[subenum(OrthoganalDirection)]
    Up,
    #[subenum(OrthoganalDirection)]
    Down,
    UpLeft,
    UpRight,
    DownLeft,
    DownRight,
}

pub trait Travel {
    fn travel(&self, dir: Direction) -> Option<Loc>;
}

impl Travel for Loc {
    fn travel(&self, dir: Direction) -> Option<Loc> {
        return match (dir, self.0, self.1) {
            (Direction::Left, _, 1..) => Some((self.0, self.1 - 1)),
            (Direction::Right, _, _) => Some((self.0, self.1 + 1)),
            (Direction::Up, 1.., _) => Some((self.0 - 1, self.1)),
            (Direction::Down, _, _) => Some((self.0 + 1, self.1)),
            (Direction::UpLeft, 1.., 1..) => Some((self.0 - 1, self.1 - 1)),
            (Direction::UpRight, 1.., _) => Some((self.0 - 1, self.1 + 1)),
            (Direction::DownLeft, _, 1..) => Some((self.0 + 1, self.1 - 1)),
            (Direction::DownRight, _, _) => Some((self.0 + 1, self.1 + 1)),
            _ => None
        }
    }
}

pub trait RowColumn {
    type Item:PartialEq;
    fn get_rc(&self, loc:Loc) -> Option<&Self::Item>;
    fn matches(&self, loc:Loc, item:&Self::Item) -> bool {
        return self.get_rc(loc).map(|i| i == item).unwrap_or(false);
    }
    fn next_rc(&self, loc:Loc, dir: Direction) -> Option<Loc>;
    fn get_next_rc(&self, loc:Loc, dir: Direction) -> Option<&Self::Item> {
        return self.next_rc(loc, dir)
            .and_then(|next_loc| self.get_rc(next_loc));
    }
    fn iter_loc (&self) -> impl Iterator<Item=(Loc, &Self::Item)>;

    fn if_exists<T>(&self, item:T, loc: Loc) -> Option<T> {
        return self.get_rc(loc).map(|_| item);
    }
}

impl <T:PartialEq> RowColumn for Vec<Vec<T>> {
    type Item = T;
    
    fn get_rc(&self, (row, column): Loc) -> Option<&Self::Item> {
        return self.get(row)?.get(column);
    }
    
    fn next_rc(&self, loc:Loc, dir: Direction) -> Option<Loc> {
        return loc.travel(dir);
    }
    
    fn iter_loc(&self) -> impl Iterator<Item=(Loc, &T)> {
        return self.iter()
            .enumerate()
            .flat_map(|(row_i, row)| (*row).iter()
                .enumerate()
                .map(move |(col_i, item)| ((row_i, col_i), item))
            );
            
    }
}

pub fn search_vec_of_vecs<T:PartialEq>(map: &Vec<Vec<T>>, target: &T) -> Option<Loc>{
    return map.iter()
        .enumerate()
        .flat_map(|(row_i, col)| col.iter()
            .enumerate()
            .find(|(_, t)| target.eq(*t))
            .map(|(col_i, _)| (row_i, col_i))
        ).next();
}

pub trait FromChar:Sized {
    type Err;
    fn from_char(c: char) -> Result<Self, Self::Err>;
}