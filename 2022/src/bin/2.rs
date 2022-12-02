use lib::inputs::d2::primary;

#[derive(Debug)]
pub enum Choice {
    Rock,
    Paper,
    Scissors
}
#[derive(Debug)]
pub enum Outcome {
  Win,
  Lose,
  Draw
}

#[derive(Debug)]
pub struct Strat {
  them: Choice,
  me:Choice,
  outcome: Outcome
}

pub fn determine_outcome(them:&Choice, me:&Choice) -> Outcome {
  match them {
    Choice::Rock => match me {
      Choice::Rock => Outcome::Draw,
      Choice::Paper => Outcome::Win,
      Choice::Scissors => Outcome::Lose
    },
    Choice::Paper => match me {
      Choice::Rock => Outcome::Lose,
      Choice::Paper => Outcome::Draw,
      Choice::Scissors => Outcome::Win
    },
    Choice::Scissors => match me {
      Choice::Rock => Outcome::Win,
      Choice::Paper => Outcome::Lose,
      Choice::Scissors => Outcome::Draw
    }
  }
}

pub fn determine_me(them:&Choice, outcome: &Outcome) -> Choice {
  match them {
    Choice::Rock => match outcome {
      Outcome::Draw => Choice::Rock,
      Outcome::Win => Choice::Paper,
      Outcome::Lose => Choice::Scissors,
    },
    Choice::Paper => match outcome {
      Outcome::Lose => Choice::Rock,
      Outcome::Draw => Choice::Paper,
      Outcome::Win => Choice::Scissors,
    },
    Choice::Scissors => match outcome {
      Outcome::Win => Choice::Rock,
      Outcome::Lose => Choice::Paper,
      Outcome::Draw => Choice::Scissors,
    }
  }
}

impl Strat {
  pub fn new2(in_str: &str) -> Self {
    let chars = in_str.chars().collect::<Vec<char>>();
    let them = match chars[0] {
      'A' => Choice::Rock,
      'B' => Choice::Paper,
      'C' => Choice::Scissors,
      _ => panic!("Unexpected them value")
    };
    let outcome = match chars[2] {
      'X' => Outcome::Lose,
      'Y' => Outcome::Draw,
      'Z' => Outcome::Win,
      _ => panic!("Unexpected outcome value")
    };
    let me = determine_me(&them, &outcome);
    Self {
      them,
      me,
      outcome,
    }
  }
  pub fn new1(in_str: &str) -> Self {
    let chars = in_str.chars().collect::<Vec<char>>();
    let them = match chars[0] {
      'A' => Choice::Rock,
      'B' => Choice::Paper,
      'C' => Choice::Scissors,
      _ => panic!("Unexpected them value")
    };
    let me = match chars[2] {
      'X' => Choice::Rock,
      'Y' => Choice::Paper,
      'Z' => Choice::Scissors,
      _ => panic!("Unexpected me value")
    };
    let outcome = determine_outcome(&them, &me);
    Self {
      them,
      me,
      outcome
    }
  }

  pub fn points(self: &Self) -> u64 {
    let shape_selected_points = match self.me {
      Choice::Rock => 1u64,
      Choice::Paper => 2u64,
      Choice::Scissors => 3u64
    };

    let outcome_points = match self.outcome {
        Outcome::Win => 6u64,
        Outcome::Lose => 0u64,
        Outcome::Draw => 3u64
    };

    return shape_selected_points + outcome_points;

  }
}

pub fn get_input1() -> Vec<Strat>{
  return primary.split("\n")
    .map(Strat::new1)
    .collect::<Vec<Strat>>();
}

pub fn get_input2() -> Vec<Strat> {
  return primary.split("\n")
    .map(Strat::new2)
    .collect::<Vec<Strat>>();
}
fn main() {
  let input = get_input1();

  let p1 = input.iter()
    .map(Strat::points)
    .sum::<u64>();

  println!("{:?}", p1);

  let input2 = get_input2();

  let p2 = input2.iter()
    .map(Strat::points)
    .sum::<u64>();

    println!("{:?}", p2);
}