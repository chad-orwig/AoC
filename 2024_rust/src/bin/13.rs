use std::str::FromStr;

use itertools::Itertools;
use lib::{inputs::d13::PRIMARY, Loc};
use num::integer::gcd;
use regex::Regex;
use lazy_static::lazy_static;

lazy_static! {
    static ref REGEX: Regex = Regex::new(r".*: X.(?<x>\d+), Y.(?<y>\d+)").unwrap();
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
struct Machine {
    a: Loc<usize>,
    b: Loc<usize>,
    prize: Loc<usize>,
}
#[derive(Debug)]
struct ParseMachineErr(String);
impl Machine {
    fn prize_adder(mut self, addend: usize) -> Machine {
        self.prize = (self.prize.0 + addend, self.prize.1 + addend);
        return self;
    }
    fn parse_line(line: &str) -> Result<Loc<usize>, ParseMachineErr> {
        let captures = REGEX.captures(line).ok_or(ParseMachineErr("Regex fail".to_string()))?;
        let x_str = captures.name("x").ok_or(ParseMachineErr("Missing x".to_string()))?;
        let y_str = captures.name("y").ok_or(ParseMachineErr("Missing y".to_string()))?;
        let x = usize::from_str(x_str.as_str()).map_err(|e| ParseMachineErr(format!("parse error for x: {:?}",e.kind())))?;
        let y = usize::from_str(y_str.as_str()).map_err(|e| ParseMachineErr(format!("parse error for y: {:?}",e.kind())))?;
        return Ok((y,x));  
    }
    fn cheapest(&self, limit: i128) -> Option<i128>{
        let solution = solve_diophantine_system(self.a.0 as i128, self.b.0 as i128, self.prize.0 as i128, self.a.1 as i128, self.b.1 as i128, self.prize.1 as i128);

        return match solution {
            DiophantineSolution::NoSolution => None,
            DiophantineSolution::SingleSolution(x, y) => {
                if x >= 0 && y >=0 && x <= limit && y <= limit {Some(3 * x + y)}
                else { None }
            },
            DiophantineSolution::InfiniteSolutions { x0: _, y0: _, t_coeff_x: _, t_coeff_y: _  } => {
                (-10000..10000).map(|t| solution.get_specific_solution(t))
                    .filter(|(x,_y)| x >= &0)
                    .filter(|(_x,y)| y >= &0)
                    .filter(|(x,_y)| x <= &limit )
                    .filter(|(_x,y)| y <= &limit )
                    .map(|(x,y)| (x * 3) + y)
                    .min()
            },
        };
    }
}
impl FromStr for Machine {
    type Err = ParseMachineErr;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let lines = s.lines().collect_vec();
        if let [a_line, b_line, prize_line] = lines[..] {
            let a = Machine::parse_line(a_line)?;
            let b = Machine::parse_line(b_line)?;
            let prize = Machine::parse_line(prize_line)?;
            return Ok(Machine { a, b, prize });
        } else {
            return Err(ParseMachineErr(format!("Wrong number of lines {}", lines.len())));
        }
    }
}
// BEGIN AI BULLSHIT TO DEAL WITH MATH BULLSHIT

#[derive(Debug)]
struct ExtendedGcd {
    gcd: i128,
    x: i128,
    y: i128,
}

#[derive(Debug)]
enum DiophantineSolution {
    NoSolution,
    SingleSolution(i128, i128),
    InfiniteSolutions {
        x0: i128,      // Base solution for x
        y0: i128,      // Base solution for y
        t_coeff_x: i128, // Coefficient for parameter t in x
        t_coeff_y: i128, // Coefficient for parameter t in y
    }
}

fn extended_gcd(a: i128, b: i128) -> ExtendedGcd {
    if b == 0 {
        ExtendedGcd {
            gcd: a.abs(),
            x: if a < 0 { -1 } else { 1 },
            y: 0,
        }
    } else {
        let result = extended_gcd(b, a % b);
        ExtendedGcd {
            gcd: result.gcd,
            x: result.y,
            y: result.x - (a / b) * result.y,
        }
    }
}

fn solve_diophantine_system(
    a1: i128, b1: i128, c1: i128,
    a2: i128, b2: i128, c2: i128
) -> DiophantineSolution {
    // Calculate determinant
    let det = a1 * b2 - a2 * b1;
    
    if det == 0 {
        // Lines are parallel or coincident
        // Check if equations are consistent
        if a1 * c2 != a2 * c1 || b1 * c2 != b2 * c1 {
            return DiophantineSolution::NoSolution;
        }
        
        // Equations are equivalent, reduce to single equation
        let gcd_a1_b1 = gcd(a1, b1);
        if c1 % gcd_a1_b1 != 0 {
            return DiophantineSolution::NoSolution;
        }
        
        // Find one solution using extended GCD
        let egcd = extended_gcd(a1, b1);
        let x0 = egcd.x * (c1 / gcd_a1_b1);
        let y0 = egcd.y * (c1 / gcd_a1_b1);
        
        return DiophantineSolution::InfiniteSolutions {
            x0,
            y0,
            t_coeff_x: -b1 / gcd_a1_b1,
            t_coeff_y: a1 / gcd_a1_b1
        };
    }

    // Check if solutions exist
    let num_x = c1 * b2 - c2 * b1;
    let num_y = a1 * c2 - a2 * c1;
    
    if num_x % det != 0 || num_y % det != 0 {
        return DiophantineSolution::NoSolution;
    }

    let x = num_x / det;
    let y = num_y / det;

    // If det != ±1, check if there are more solutions
    if det.abs() == 1 {
        DiophantineSolution::SingleSolution(x, y)
    } else {
        DiophantineSolution::InfiniteSolutions {
            x0: x,
            y0: y,
            t_coeff_x: b2 / det,
            t_coeff_y: -a2 / det
        }
    }
}
impl DiophantineSolution {
    // Helper function to get a specific solution for parameter t
    fn get_specific_solution(&self, t: i128) -> (i128, i128) {
        match self {
            DiophantineSolution::InfiniteSolutions { x0, y0, t_coeff_x, t_coeff_y } => {
                let x = x0 + t_coeff_x * t;
                let y = y0 + t_coeff_y * t;
                (x, y)
            }
            _ => panic!("Not an infinite solution")
        }
        
    }
}


fn main() {
    let machines = PRIMARY.split("\n\n")
        .flat_map(Machine::from_str)
        .collect_vec();

    let p1 = machines.iter()
        .flat_map(|m| m.cheapest(100))
        .sum::<i128>();
    println!("{p1}");

    let machines = machines.into_iter()
        .map(|m| m.prize_adder(10000000000000))
        .collect_vec();

    let p2 = machines.iter()
        .flat_map(|m| m.cheapest(i128::MAX))
        .sum::<i128>();

    println!("{p2}");

}