use std::{ops::Add, collections::HashMap, hash::Hash, iter::Map};

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

pub struct GridSlice<'a, K,V> where K: ChadNum {
  pub slice: HashMap<K, HashMap<K, &'a V>>,
  pub mins: HashMap<K,K>,
  pub maxes: HashMap<K,K>,
}

impl<'a, K, V> GridSlice<'a, K, V> where K: ChadNum {
  pub fn row_slice(grid: &'a Grid<K,V>) -> Self {
    let slice = grid.rows();
    let mins = slice.iter()
      .map(|(k, s)| (k, s.iter().map(|(v,_)| v ).min().unwrap()))
      .map(|(k,v)| (k.clone(), v.clone()))
      .collect();

    let maxes = slice.iter()
      .map(|(k, s)| (k, s.iter().map(|(v,_)| v ).max().unwrap()))
      .map(|(k,v)| (k.clone(), v.clone()))
      .collect();

    GridSlice { slice, mins, maxes }
  }

  pub fn col_slice(grid: &'a Grid<K,V>) -> Self {
    let slice = grid.columns();
    let mins = slice.iter()
      .map(|(k, s)| (k, s.iter().map(|(v,_)| v ).min().unwrap()))
      .map(|(k,v)| (k.clone(), v.clone()))
      .collect();

    let maxes = slice.iter()
      .map(|(k, s)| (k, s.iter().map(|(v,_)| v ).max().unwrap()))
      .map(|(k,v)| (k.clone(), v.clone()))
      .collect();

    GridSlice { slice, mins, maxes }
  }
}

pub struct Grid<K, V> where K: ChadNum {
  pub grid: HashMap<Point<K>, V>,
}

impl<K,V> Grid<K, V> where K: ChadNum {

  pub fn iter(&self) -> impl Iterator<Item = (K, K, &V)> {
    self.grid.iter()
      .map(|(p, v)| (p.y, p.x, v))
  }

  fn rows(&self) -> HashMap<K, HashMap<K, &V>> {
    self.iter()
      .fold(HashMap::new(), |mut m,(row, col, v)| {
        let cols = m.entry(row).or_default();
        cols.insert(col, v);
        m
      })
  }

  fn columns(&self) ->  HashMap<K, HashMap<K, &V>> {
    self.iter()
      .fold(HashMap::new(), |mut m,(row, col, v)| {
        let rows = m.entry(col).or_default();
        rows.insert(row, v);
        m
      })
  }
}

fn grid_entry_to_tuple<K,V>((p, v): (Point<K>, V)) -> (K, K, V) where K: ChadNum {
  (p.x, p.y, v)
}

impl<K,V> IntoIterator for Grid<K,V> where K: ChadNum {
    type Item = (K, K, V);
    type IntoIter = Map<std::collections::hash_map::IntoIter<Point<K>, V>, fn ((Point<K>, V)) -> (K, K, V)>;

    fn into_iter(self) -> Self::IntoIter {
      self.grid.into_iter()
        .map(grid_entry_to_tuple)
    }
}

impl <K,V> FromIterator<(K, K, V)> for Grid<K,V> where K: ChadNum {
  fn from_iter<T: IntoIterator<Item = (K, K, V)>>(iter: T) -> Self {
    let grid = iter.into_iter()
      .fold(HashMap::new(), |mut m, (x, y, v)| {
        m.insert(Point::from_tuple((x,y)), v);
        m
      });

    Grid { grid }
  }
}
