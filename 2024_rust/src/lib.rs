use std::cmp::Ordering;

use num::{PrimInt, Signed, Unsigned};
use num_traits::ops::overflowing::OverflowingSub;
use strum_macros::EnumIter;
use subenum::subenum;

pub mod inputs;

pub type Loc<T: PrimInt> = (T, T);

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

pub trait Travel <T:PrimInt> {
    fn travel(&self, dir: Direction) -> Option<Loc<T>>;
}

impl <T:PrimInt + OverflowingSub> Travel<T> for Loc<T>{
    fn travel(&self, dir: Direction) -> Option<Loc<T>> {
        let one = T::one();
        let (neg_y, overflow_y) = self.0.overflowing_sub(&one);
        let (neg_x, overflow_x) = self.1.overflowing_sub(&one);
        return match (dir, overflow_y, overflow_x) {
            (Direction::Left, _, false) => Some((self.0, neg_x)),
            (Direction::Right, _, _) => Some((self.0, self.1 + T::one())),
            (Direction::Up, false, _) => Some((neg_y, self.1)),
            (Direction::Down, _, _) => Some((self.0 + T::one(), self.1)),
            (Direction::UpLeft, false, false) => Some((neg_y,neg_x)),
            (Direction::UpRight, false, _) => Some((neg_y, self.1 + T::one())),
            (Direction::DownLeft, _, false) => Some((self.0 + T::one(), neg_x)),
            (Direction::DownRight, _, _) => Some((self.0 + T::one(), self.1 + T::one())),
            _ => None
        }
    }
}

pub trait RowColumn<L:PrimInt> {
    type Item:PartialEq;
    fn get_rc(&self, loc:Loc<L>) -> Option<&Self::Item>;
    fn matches(&self, loc:Loc<L>, item:&Self::Item) -> bool {
        return self.get_rc(loc).map(|i| i == item).unwrap_or(false);
    }
    fn next_rc(&self, loc:Loc<L>, dir: Direction) -> Option<Loc<L>>;
    fn get_next_rc(&self, loc:Loc<L>, dir: Direction) -> Option<&Self::Item> {
        return self.next_rc(loc, dir)
            .and_then(|next_loc| self.get_rc(next_loc));
    }
    fn iter_loc<'a> (&'a self) -> impl Iterator<Item=(Loc<L>, &'a Self::Item)> where <Self as RowColumn<L>>::Item: 'a;

    fn if_exists<T>(&self, item:T, loc: Loc<L>) -> Option<T> {
        return self.get_rc(loc).map(|_| item);
    }
}

impl <T:PartialEq> RowColumn<usize> for Vec<Vec<T>> {
    type Item = T;
    
    fn get_rc(&self, (row, column): Loc<usize>) -> Option<&Self::Item> {
        return self.get(row)?.get(column);
    }
    
    fn next_rc(&self, loc:Loc<usize>, dir: Direction) -> Option<Loc<usize>> {
        return loc.travel(dir);
    }
    
    fn iter_loc<'a> (&'a self) -> impl Iterator<Item=(Loc<usize>, &'a Self::Item)> where <Self as RowColumn<usize>>::Item: 'a {
        return self.iter()
            .enumerate()
            .flat_map(|(row_i, row)| (*row).iter()
                .enumerate()
                .map(move |(col_i, item)| ((row_i, col_i), item))
            );
    }
    
}

pub fn search_vec_of_vecs<T:PartialEq>(map: &Vec<Vec<T>>, target: &T) -> Option<Loc<usize>>{
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