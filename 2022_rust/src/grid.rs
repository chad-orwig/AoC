use std::ops::Add;

use crate::ChadNum;



#[derive(Debug, PartialEq, Eq, Hash, Clone)]
pub struct Point<T: ChadNum> {
  pub x: T,
  pub y: T,
}

impl<T: ChadNum> Add for Point<T> {
    type Output = Point<T>;

    fn add(self, rhs: Self) -> Self::Output {
      Point::from_tuple((self.x + rhs.x, self.y + rhs.y))
    }
}

impl<'a, 'b, T: ChadNum> Add<&'b Point<T>> for &'a Point<T> 
where &'a T: Add<&'b T, Output = T> {
  type Output = Point<T>;

  fn add(self, rhs: &'b Point<T>) -> Self::Output {
    Point::from_tuple((&self.x + &rhs.x, &self.y + &rhs.y))
  }
}

impl<T: ChadNum> Point<T> {
  pub fn from_tuple(p: (T, T)) -> Self {
    Point { x: p.0, y: p.1 }
  }
}