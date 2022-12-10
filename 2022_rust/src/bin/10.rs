use lib::inputs::d10::PRIMARY;

fn main() {
  let mut x = 1i64;
  let mut cycle = 0i64;
  let mut strength = 0i64;
  let mut screen = [[' '; 40]; 6];

  let cycle_tick = |cycle: &mut i64, strength: &mut i64, x: &i64, screen: &mut [[char; 40]; 6]| {
    let col = *cycle % 40;
    let diff = x - col;
    match diff {
      -1 | 0 | 1 => {
        let row = *cycle / 40;
        screen[row as usize][col as usize] = '█';
      },
      _ => (),
    }

    *cycle += 1;
    
    if (*cycle + 20) % 40 == 0 {
      let to_add = *cycle * x;
      *strength += to_add;
      
    }
  };

  PRIMARY.split("\n")
    .map(|line| {
      let mut split = line.split(' ');
      let command = split.next().unwrap();
      let val = split
        .next()
        .map(str::parse::<i64>)
        .map(Result::unwrap);

      return (command, val);
    })
    .for_each(|(command, val)|{
      cycle_tick(&mut cycle, &mut strength, &x, &mut screen);
      match command {
        "addx" => {
          cycle_tick(&mut cycle, &mut strength, &x, &mut screen);
          x += val.unwrap();
        },
        "noop" => (),
        _ => panic!("Unknown Command {}", command)
      }
    });

  println!("{}", strength);

  screen.iter()
    .for_each(|arr| println!("{}", arr.iter().collect::<String>()));
}