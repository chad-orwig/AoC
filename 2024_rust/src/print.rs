use std::{collections::HashMap, fmt::Display};


pub trait Printable {
    fn print(&self);
}

impl <T: Display+Default>Printable for HashMap<(usize,usize), T> {
    fn print(&self) {
        let (max_y, max_x) = self.keys()
            .cloned()
            .reduce(|(curr_y,curr_x), (new_y, new_x)|(curr_y.max(new_y), curr_x.max(new_x)))
            .unwrap();
        for y in 0..=max_y {
            for x in 0..=max_x {
                print!("{}", self.get(&(y,x)).unwrap_or(&T::default()))
            }
            println!();
        }
    }
}

impl <T: Display>Printable for Vec<Vec<T>> {
    fn print(&self) {
        self.iter()
            .for_each(|line| {
                line.iter().for_each(|i| print!("{i}"));
                println!("")
            });
    }
}