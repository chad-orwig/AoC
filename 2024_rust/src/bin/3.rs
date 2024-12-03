use itertools::Itertools;
use lib::inputs::d3::PRIMARY;
use regex::{Captures, Regex};

fn is_enabled_fn<'a>(do_indecies: &'a Vec<usize>, dont_indecies: &'a Vec<usize>) -> impl Fn(&Captures<'a>) -> bool {
    move | capture| {
        let start = capture.get(0).unwrap().start();

        let dont_index_plus = dont_indecies
            .binary_search(&start)
            .unwrap_err();

        // If before the first don't, return true
        if dont_index_plus == 0 { return true; }

        let do_index_plus = do_indecies
            .binary_search(&start)
            .unwrap_err();

        // If after the first don't but before the first do, return false;
        if do_index_plus == 0 { return false; }
        
        let dont_index = dont_indecies[dont_index_plus - 1];
        let do_index = do_indecies[do_index_plus - 1];

        return do_index > dont_index;
    }
}

fn main() {
    let valid_mul = Regex::new(r"mul\((?<x>\d+),(?<y>\d+)\)").unwrap();
    let do_regex = Regex::new(r"do()").unwrap();
    let dont_regex = Regex::new(r"don't()").unwrap();

    let p1 = valid_mul
        .captures_iter(PRIMARY)
        .map(|capture| (capture.name("x").unwrap(), capture.name("y").unwrap()))
        .map(|(x_match,y_match)| (x_match.as_str(), y_match.as_str()))
        .map(|(x_str,y_str)|(x_str.parse::<i64>().unwrap(), y_str.parse::<i64>().unwrap()))
        .map(|(x,y)| x * y)
        .sum::<i64>();

    println!("{:?}", p1);

    let do_indecies = do_regex
        .find_iter(PRIMARY)
        .map(|m| m.start())
        .collect_vec();
    let dont_indecies = dont_regex
        .find_iter(PRIMARY)
        .map(|m| m.start())
        .collect_vec();

    let is_enabled = is_enabled_fn(&do_indecies, &dont_indecies);

    let p2 = valid_mul
        .captures_iter(PRIMARY)
        .filter(is_enabled)
        .map(|capture| (capture.name("x").unwrap(), capture.name("y").unwrap()))
        .map(|(x_match,y_match)| (x_match.as_str(), y_match.as_str()))
        .map(|(x_str,y_str)|(x_str.parse::<i64>().unwrap(), y_str.parse::<i64>().unwrap()))
        .map(|(x,y)| x * y)
        .sum::<i64>();
    println!("{:?}", p2);
    
}