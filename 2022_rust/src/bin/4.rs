use lib::inputs::d4::PRIMARY;

pub fn get_input() -> Vec<[u32; 4]> {
  return PRIMARY.split("\n")
    .map(|line| line.split(",")
      .map(|elf| elf.split("-")
        .map(str::parse::<u32>)
        .map(Result::unwrap)
      ).flatten()
    ).flatten()
    .collect::<Vec<u32>>()
    .chunks_exact(4)
    .map(|arr|[arr[0], arr[1], arr[2], arr[3]])
    .collect();
}
pub fn main() {
  let input = get_input();

  let p1 = input.iter()
    .filter(|[a,b,c,d]|(a <= c && b >= d) || (c <= a && d >= b))
    .count();

  println!("{:?}", p1);

  let p2 = input.iter()
    .filter(|[a,b,c,d]| (c <= b && a < d) || (b <= c && d < a) || d == a)
    .count();

    println!("{:?}", p2);
}