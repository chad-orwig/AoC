use std::{collections::HashSet, str::FromStr};

use itertools::Itertools;
use lazy_static::lazy_static;
use lib::{inputs::d14::{PRIMARY, TEST}, Loc};
use regex::Regex;

lazy_static! {
    static ref ROBOT_REGEX: Regex = Regex::new(r"p=(?<px>-?\d+),(?<py>-?\d+) v=(?<vx>-?\d+),(?<vy>-?\d+)").unwrap();
}
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
struct Robot {
    pos: Loc<i128>,
    vel: Loc<i128>,
}
struct ParseRobotErr;

impl FromStr for Robot {
    type Err = ParseRobotErr;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let captures = ROBOT_REGEX.captures(s).unwrap();
        let px: i128 = captures.name(&"px").and_then(|m|m.as_str().parse().ok()).ok_or(ParseRobotErr)?;
        let py: i128 = captures.name(&"py").and_then(|m|m.as_str().parse().ok()).ok_or(ParseRobotErr)?;
        let vx: i128 = captures.name(&"vx").and_then(|m|m.as_str().parse().ok()).ok_or(ParseRobotErr)?;
        let vy: i128 = captures.name(&"vy").and_then(|m|m.as_str().parse().ok()).ok_or(ParseRobotErr)?;

        return Ok(Robot {
            pos: (px, py),
            vel: (vx, vy),
        });
    }
}

impl Robot {
    fn simulate(&self, seconds: &i128, size: &Loc<i128>) -> Loc<i128> {
        let mut px = self.pos.0 + (self.vel.0 * seconds);
        px = px % size.0;
        if px < 0 { px = size.0 + px }

        let mut py = self.pos.1 + (self.vel.1 * seconds);
        py = py % size.1;
        if py < 0 { py = size.1 + py }
        return (px, py);
    }
}

fn print_bots(locs: &Vec<Loc<i128>>, size: &Loc<usize>) {
    let mut rows = Vec::with_capacity(size.1);
    (0..size.1).for_each(|_| {
        let mut cols = Vec::with_capacity(size.0);
        (0..size.0).for_each(|_| cols.push(" "));
        rows.push(cols);
    });

    locs.iter().for_each(|(x,y)| rows[*y as usize][*x as usize] = "█");
    rows.iter()
        .map(|c| c.join(""))
        .for_each(|line| println!("{line}"));
}

fn candidate(locs: &Vec<Loc<i128>>) -> bool {
    let unique: HashSet<&Loc<i128>> = locs.iter()
        .collect();
    return unique.len() == 500;

}

fn main() {
    let robots = PRIMARY.lines()
        .flat_map(str::parse::<Robot>)
        .collect_vec();

    let [q1,q2,q3,q4] = robots.iter()
        .map(|r| r.simulate(&100, &(101, 103)))
        .fold([0,0,0,0], |[q1,q2,q3,q4]: [i128;4], loc| {
            match loc {
                (0..50, 0..51) => [q1 + 1, q2, q3, q4],
                (51..101, 0..51) => [q1, q2 + 1, q3, q4],
                (0..50, 52..103) => [q1, q2, q3 + 1, q4],
                (51..101, 52..103) => [q1, q2, q3, q4 + 1],
                _ => [q1,q2,q3,q4]
            }
        });
    let p1 = q1 * q2 * q3 * q4;
    println!("num bots: {}", robots.len());
    println!("{:?}", p1);

    let mut time: i128 = 1;

    let mut locs = robots.iter()
        .map(|r| r.simulate(&time, &(101, 103)))
        .collect_vec();

    while!candidate(&locs) {
        time += 1;
        locs = robots.iter()
            .map(|r| r.simulate(&time, &(101, 103)))
            .collect_vec();
    }
    print_bots(&locs, &(101, 103));
    println!("{time}");
}