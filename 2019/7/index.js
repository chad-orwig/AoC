const {permutations} = require('../../utils');
const {test1, input:myInput, test2, test3} = require('./input');
const intCode = require('../intCode');

const program = myInput;

let input;

function* inputFunction(phase) {
    yield phase;
    while(true) {
        yield input;
    }
}

function* amplifierInput(phase, inputAmplifier) {
    yield phase;
    yield* inputAmplifier;
}

function runAmplifiers(phases) {
    input = 0;
    let lastAmp;

    phases.forEach((phase, index) => {
        const inputForAmp = index ? amplifierInput(phase, lastAmp) : inputFunction(phase);
        lastAmp = intCode(program, inputForAmp);
    });

    for(let value of lastAmp) {
        input = value;
    }

    return input;
}

const phasePossibilities = permutations([0,1,2,3,4]);


let maxThruster = 0;
phasePossibilities.forEach(phases => {
    maxThruster = Math.max(runAmplifiers(phases), maxThruster);
});

console.log(maxThruster);


const partTwoPossibilities = permutations([5,6,7,8,9]);

let maxPart2 = 0;

partTwoPossibilities.forEach(phases => {
    maxPart2 = Math.max(maxPart2, runAmplifiers(phases));
});

console.log(maxPart2);