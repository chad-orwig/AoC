use std::{collections::{HashMap, HashSet}, str::FromStr};

use itertools::Itertools;
use lib::inputs::d5::PRIMARY;

struct Rule (i64, i64);
struct ParseRuleError;

impl FromStr for Rule {
    type Err = ParseRuleError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let o: Option<(i64, i64)> = s.split("|")
            .flat_map(str::parse::<i64>)
            .collect_tuple();

        return o.map(|(t0, t1)| Rule(t0, t1))   
            .ok_or(ParseRuleError);
    }
}

fn rule_is_ok(seen: &HashSet<&i64>, rule: &Rule, new_page: &i64) -> bool{
    if rule.0 == *new_page {
        return !seen.contains(&rule.1);
    }
    else {
        return true;
    }
}

fn fix_update(update: &Vec<i64>, rules_ref: &HashMap<i64, Vec<usize>>, rules: &Vec<Rule>) -> Vec<i64> {
    let mut seen = HashSet::<&i64>::new();

    for page in update {

        seen.insert(page);
        let broken_rules = rules_ref.get(page)
            .map(|v| v.iter()
                .map(|i| rules.get(*i))
                .flatten()
        )
        .map(|mut rules_about_page| rules_about_page
            .filter(|rule| !rule_is_ok(&seen, rule, &page))
            .collect_vec()
        ).unwrap();

        if !broken_rules.is_empty() {
            let rule = broken_rules[0];
            let new_attempt = update.iter()
                .map(|num| if num == &rule.0 { rule.1 } else if num == &rule.1 { rule.0 } else { *num })
                .collect_vec();
            return fix_update(&new_attempt, rules_ref, rules);
        };
    }
    return update.to_vec();
}

fn update_in_order(update: &Vec<i64>, rules_ref: &HashMap<i64, Vec<usize>>, rules: &Vec<Rule>) -> bool {
    let mut seen = HashSet::<&i64>::new();

    for page in update {

        seen.insert(page);
        let ok = rules_ref.get(page)
            .map(|v| v.iter()
                .map(|i| rules.get(*i))
                .flatten()
        )
        .map(|mut rules_about_page| rules_about_page
            .all(|rule| rule_is_ok(&seen, rule, &page))
        ).unwrap_or(true);

        if !ok { return false };
    }
    return true;
}

fn middle<T:Clone> (v: &Vec<T>) -> Option<T> {
    if v.len() % 2 == 0 { return None; }
    let i: usize = (v.len() - 1) / 2;
    return v.get(i).map(|t| t.clone());
}

fn main() {
    let (rules_in, updates_in): (&str, &str) = PRIMARY.split("\n\n")
        .collect_tuple()
        .unwrap();
    let rules = rules_in.split("\n")
        .flat_map(str::parse::<Rule>)
        .collect_vec();
    let updates = updates_in.split("\n")
        .map(|line| line.split(",")
            .flat_map(str::parse::<i64>)
            .collect_vec()
        )
        .collect_vec();

    let rules_reference = rules.iter()
        .enumerate()
        .fold(HashMap::<i64, Vec<usize>>::new(), |mut map, (index, rule)| {
            let v0 = map.entry(rule.0).or_insert(Vec::new());
            v0.push(index);
            let v1 = map.entry(rule.1).or_insert(Vec::new());
            v1.push(index);
            
            return map;
        });

    let p1 = updates.iter()
        .filter(|update|update_in_order(update, &rules_reference, &rules))
        .flat_map(middle)
        .sum::<i64>();
    println!("{}", p1);

    let p2 = updates.iter()
        .filter(|update| !update_in_order(update, &rules_reference, &rules))
        .map(|update| fix_update(update, &rules_reference, &rules))
        .flat_map(|v: Vec<i64>| middle(&v))
        .sum::<i64>();

        println!("{}", p2);
    
}