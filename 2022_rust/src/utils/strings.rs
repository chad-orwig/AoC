pub struct FunctionalSplit<'a> {
  line: &'a str,
  finished: bool,
  loc: usize,
  next_index: &'a dyn Fn(&str) -> Option<usize>
}

pub trait FunctionallySplittable<'a> {
  fn functional_split(&'a self, splitter: &'a dyn Fn(&str) -> Option<usize>) -> FunctionalSplit<'a>;
}

impl<'a> FunctionallySplittable<'a> for str {
    fn functional_split(&'a self, splitter: &'a dyn Fn(&str) -> Option<usize>) -> FunctionalSplit<'a> {
      FunctionalSplit { line: self, finished: false, loc: 0, next_index: splitter }
    }
}

impl<'a> Iterator for FunctionalSplit<'a> {
  type Item = &'a str;

  fn next(&mut self) -> Option<Self::Item> {
    if self.finished { return None; }
    let i = (self.next_index)(&self.line[self.loc..]);

    let start = self.loc.clone();

    match i {
      Some(index) => {
        self.loc = start + index + 1;
        self.finished = self.loc == self.line.len();
        return Some(&self.line[start..index + start]);
      }
      None => {
        self.finished = true;
        return if self.loc == self.line.len() { None } else { Some(&self.line[self.loc..])}
      }
    }
  }
}