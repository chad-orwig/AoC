const {permutations} = require('../../utils');
const {test1, input:myInput, test2, test3} = require('./input');
const intCode = require('../intCode');

const program = myInput;

let input;

function setInput(i) {
    input = i;
}

function* inputFunction(phase) {
    yield phase;
    while(true) {
        yield input;
    }
}

const phasePossibilities = permutations([0,1,2,3,4]);

function runPhases(phases) {
    let maxOutput = 0;
    input = 0;
    phases.forEach(phase => {
        input = intCode(program, inputFunction(phase)).next().value;
        maxOutput = Math.max(maxOutput, input);
    });

    return maxOutput;
}

let maxThruster = 0;
phasePossibilities.forEach(phases => {
    maxThruster = Math.max(runPhases(phases), maxThruster);
});

console.log(maxThruster);

function runProgramsPart2(phases) {
    const amplifiers = [];
    let finished = false;
    let index = 0;
    let ans;
    const programAInput = function* () {
        yield phases[0];
        yield 0;
        while(true) {
            yield ans;
        }
    }
    amplifiers.push(intCode(program, programAInput()));
    for(let i = 1; i < phases.length; i++) {
        amplifiers.push(intCode(program, amplifierInput(phases[i], amplifiers[i - 1])));
    }
    const lastAmp = amplifiers[amplifiers.length - 1];

    while(!finished) {
        const { done, value } = lastAmp.next();
        finished = done;
        if(!finished) {
            ans = value;
        }
    }
    return ans;
}

function* amplifierInput(phase, inputAmplifier) {
    yield phase;
    yield* inputAmplifier;
}


const partTwoPossibilities = permutations([5,6,7,8,9]);

let maxPart2 = 0;

partTwoPossibilities.forEach(phases => {
    maxPart2 = Math.max(maxPart2, runProgramsPart2(phases));
});

console.log(maxPart2);