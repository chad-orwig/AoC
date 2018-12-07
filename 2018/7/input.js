const input = "Step J must be finished before step E can begin.\n" +
    "Step X must be finished before step G can begin.\n" +
    "Step D must be finished before step A can begin.\n" +
    "Step K must be finished before step M can begin.\n" +
    "Step P must be finished before step Z can begin.\n" +
    "Step F must be finished before step O can begin.\n" +
    "Step B must be finished before step I can begin.\n" +
    "Step U must be finished before step W can begin.\n" +
    "Step A must be finished before step R can begin.\n" +
    "Step E must be finished before step R can begin.\n" +
    "Step H must be finished before step C can begin.\n" +
    "Step O must be finished before step S can begin.\n" +
    "Step Q must be finished before step Y can begin.\n" +
    "Step V must be finished before step W can begin.\n" +
    "Step T must be finished before step N can begin.\n" +
    "Step S must be finished before step I can begin.\n" +
    "Step Y must be finished before step W can begin.\n" +
    "Step Z must be finished before step C can begin.\n" +
    "Step M must be finished before step L can begin.\n" +
    "Step L must be finished before step W can begin.\n" +
    "Step N must be finished before step I can begin.\n" +
    "Step I must be finished before step G can begin.\n" +
    "Step C must be finished before step G can begin.\n" +
    "Step G must be finished before step R can begin.\n" +
    "Step R must be finished before step W can begin.\n" +
    "Step Z must be finished before step R can begin.\n" +
    "Step Z must be finished before step N can begin.\n" +
    "Step G must be finished before step W can begin.\n" +
    "Step L must be finished before step G can begin.\n" +
    "Step Y must be finished before step R can begin.\n" +
    "Step P must be finished before step I can begin.\n" +
    "Step C must be finished before step W can begin.\n" +
    "Step T must be finished before step G can begin.\n" +
    "Step T must be finished before step R can begin.\n" +
    "Step V must be finished before step Z can begin.\n" +
    "Step L must be finished before step C can begin.\n" +
    "Step K must be finished before step I can begin.\n" +
    "Step J must be finished before step I can begin.\n" +
    "Step Q must be finished before step C can begin.\n" +
    "Step F must be finished before step A can begin.\n" +
    "Step H must be finished before step Y can begin.\n" +
    "Step M must be finished before step N can begin.\n" +
    "Step P must be finished before step H can begin.\n" +
    "Step M must be finished before step C can begin.\n" +
    "Step V must be finished before step Y can begin.\n" +
    "Step O must be finished before step V can begin.\n" +
    "Step O must be finished before step Q can begin.\n" +
    "Step A must be finished before step G can begin.\n" +
    "Step T must be finished before step Z can begin.\n" +
    "Step K must be finished before step R can begin.\n" +
    "Step H must be finished before step O can begin.\n" +
    "Step O must be finished before step Y can begin.\n" +
    "Step O must be finished before step C can begin.\n" +
    "Step K must be finished before step P can begin.\n" +
    "Step P must be finished before step F can begin.\n" +
    "Step E must be finished before step M can begin.\n" +
    "Step M must be finished before step I can begin.\n" +
    "Step T must be finished before step W can begin.\n" +
    "Step P must be finished before step L can begin.\n" +
    "Step A must be finished before step O can begin.\n" +
    "Step X must be finished before step V can begin.\n" +
    "Step S must be finished before step G can begin.\n" +
    "Step A must be finished before step Y can begin.\n" +
    "Step J must be finished before step R can begin.\n" +
    "Step K must be finished before step F can begin.\n" +
    "Step J must be finished before step A can begin.\n" +
    "Step P must be finished before step C can begin.\n" +
    "Step E must be finished before step N can begin.\n" +
    "Step F must be finished before step Y can begin.\n" +
    "Step J must be finished before step D can begin.\n" +
    "Step H must be finished before step Z can begin.\n" +
    "Step U must be finished before step H can begin.\n" +
    "Step J must be finished before step T can begin.\n" +
    "Step V must be finished before step G can begin.\n" +
    "Step Z must be finished before step I can begin.\n" +
    "Step H must be finished before step W can begin.\n" +
    "Step B must be finished before step R can begin.\n" +
    "Step F must be finished before step B can begin.\n" +
    "Step X must be finished before step C can begin.\n" +
    "Step L must be finished before step R can begin.\n" +
    "Step F must be finished before step U can begin.\n" +
    "Step D must be finished before step N can begin.\n" +
    "Step P must be finished before step O can begin.\n" +
    "Step B must be finished before step O can begin.\n" +
    "Step F must be finished before step C can begin.\n" +
    "Step H must be finished before step L can begin.\n" +
    "Step O must be finished before step N can begin.\n" +
    "Step J must be finished before step Y can begin.\n" +
    "Step H must be finished before step N can begin.\n" +
    "Step O must be finished before step L can begin.\n" +
    "Step I must be finished before step W can begin.\n" +
    "Step J must be finished before step H can begin.\n" +
    "Step D must be finished before step Z can begin.\n" +
    "Step F must be finished before step W can begin.\n" +
    "Step X must be finished before step W can begin.\n" +
    "Step Y must be finished before step M can begin.\n" +
    "Step T must be finished before step M can begin.\n" +
    "Step U must be finished before step G can begin.\n" +
    "Step L must be finished before step I can begin.\n" +
    "Step N must be finished before step W can begin.\n" +
    "Step E must be finished before step C can begin.";

const inputArray = input.split("\n");

const inputParser = /Step (\w) must be finished before step (\w) can begin./;

const rules = inputArray.map(s => {
    const execResults = inputParser.exec(s);
    return {
        parent : execResults[1],
        child : execResults[2]
    };
});

module.exports = rules;