use std::{fmt, ops::Shr, str::FromStr};

use itertools::Itertools;
use lib::inputs::d17::{PRIMARY, TEST};

struct Computer {
    a: i128,
    b: i128,
    c: i128,
    instruction_pointer: usize,
    out: Vec<i128>,
}

impl fmt::Debug for Computer {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("Computer").field("a", &self.a).field("b", &self.b).field("c", &self.c).field("instruction_pointer", &self.instruction_pointer).field("out", &self.out).finish()
    }
}

impl fmt::Binary for Computer {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Computer {{ a: {:b}, b: {:b}, c: {:b} }}", self.a, self.b, self.c)
    }
}
#[derive(Debug)]
enum Instruction {
    Adv,
    Bxl,
    Bst,
    Jnz,
    Bxc,
    Out,
    Bdv,
    Cdv
}

impl From<i128> for Instruction {
    fn from(value: i128) -> Instruction {
        match value {
            0 => Instruction::Adv,
            1 => Instruction::Bxl,
            2 => Instruction::Bst,
            3 => Instruction::Jnz,
            4 => Instruction::Bxc,
            5 => Instruction::Out,
            6 => Instruction::Bdv,
            7 => Instruction::Cdv,
            _ => panic!()
        }
    }
}

impl Computer {

    fn process(&mut self, program: &Vec<i128>) -> Option<()> {
        let op_code = *program.get(self.instruction_pointer)?;
        let operand = *program.get(self.instruction_pointer + 1)?;
        let instruction = Instruction::from(op_code);
        println!("{:?}: {}", instruction, operand);
        match instruction {
            Instruction::Adv => self.do_adv(operand),
            Instruction::Bxl => self.do_bxl(operand),
            Instruction::Bst => self.do_bst(operand),
            Instruction::Jnz => self.do_jnz(operand),
            Instruction::Bxc => self.do_bxc(),
            Instruction::Out => self.do_out(operand),
            Instruction::Bdv => self.do_bdv(operand),
            Instruction::Cdv => self.do_cdv(operand),
        }
        println!("{:b}", self);
        Some(())
    }
    fn combo_op(&self, n: i128) -> i128 {
        match n {
            0..=3 => n,
            4 => self.a,
            5 => self.b,
            6 => self.c,
            _ => panic!()
        }
    }

    fn do_adv(&mut self, operand: i128) {
        let combo = self.combo_op(operand);
        let result = self.a >> combo;
        self.a = result;
        self.instruction_pointer += 2;
    }
    fn do_bxl(&mut self, operand: i128) {
        self.b = self.b ^ operand;
        self.instruction_pointer += 2;
    }
    fn do_bst(&mut self, operand: i128) {
        let combo = self.combo_op(operand);
        self.b = combo % 8;
        self.instruction_pointer += 2;
    }
    fn do_jnz(&mut self, operand: i128) {
        if self.a == 0 { self.instruction_pointer += 2; }
        else {
            self.instruction_pointer = operand as usize;
        }
    }
    fn do_bxc(&mut self) {
        self.b = self.b ^ self.c;
        self.instruction_pointer += 2;
    }
    fn do_out(&mut self, operand: i128) {
        let combo = self.combo_op(operand);
        self.out.push(combo % 8);
        self.instruction_pointer += 2;
    }
    fn do_bdv(&mut self, operand: i128) {
        let combo = self.combo_op(operand);
        let result = self.a >> combo;
        self.b = result;
        self.instruction_pointer += 2;
    }
    fn do_cdv(&mut self, operand: i128) {
        let combo = self.combo_op(operand);
        let result = self.a >> combo;
        self.c = result;
        self.instruction_pointer += 2;
    }
}
#[derive(Debug)]
struct ParseComputerErr;
impl FromStr for Computer {
    type Err = ParseComputerErr;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let [a,b,c] = s.lines()
            .map(|l| l.split(": ")
                .last()
                .unwrap()
                .parse::<i128>()
                .unwrap()
            ).collect_vec()[..]
            else {
                return Err(ParseComputerErr);
            };
        
        Ok(Computer {
            a,
            b,
            c,
            instruction_pointer: 0,
            out: Vec::new(),
        })
    }
}

fn main() {
    let [computer_in, progam_in] = PRIMARY.split("\n\n")
        .collect_vec()[..]
        else { panic!() };
    let mut computer: Computer = computer_in.parse().unwrap();
    let program = progam_in.split(": ")
        .last()
        .map(|l| l.split(',')
            .flat_map(str::parse::<i128>)
        ).unwrap()
        .collect_vec();

    while let Some(_) = computer.process(&program) {}
    println!("{}", computer.out.iter().join(","));
    
    // let mut a:i128 = 0;
    // let mut count: i128 = 0;
    // loop {
    //     a = (count << 19) + 507380;
    //     computer = computer_in.parse().unwrap();
    //     computer.a = a;

    //     while let Some(_) = computer.process(&program) {
    //         if program[0..computer.out.len().min(program.len())] != computer.out[..] {
    //             break;
    //         }
    //     }
    //     if computer.out.len() > 11  && a % 131072 != 48628 {
    //         computer.out.pop();
    //         println!("a: {:b} match: {:?}", a, computer.out)
    //     }
    //     if computer.out == program {
    //         break;
    //     }
    //     if  a > 2289021083762164 { panic!("too high")}
    //     count += 1;
    // }
    // println!("{a}");
}