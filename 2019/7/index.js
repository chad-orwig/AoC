const {permutations} = require('../../utils');
const {test1, input:myInput, test2, test3} = require('./input');
const intCode = require('../intCode');
const intCodeGen = require('../intCodeGen');

const program = myInput;

let input;

function setInput(i) {
    input = i;
}

function inputFunction(phase) {
    let firstTime = true;
    return () => {
        if(firstTime) {
            firstTime = false;
            return phase;
        }
        return input;
    }
}

const phasePossibilities = permutations([0,1,2,3,4]);

function runPhases(phases) {
    let maxOutput = 0;
    input = 0;
    phases.forEach(phase => {
        intCode(program, inputFunction(phase), setInput);
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
    input = 0;
    const amplifiers = [];
    let done = false;
    let index = 0;
    let ans;
    while(!done) {
        const amp = amplifiers[index] || buildAmplifier(phases[index]);
        amplifiers[index] = amp;
        const res = amp.next();
        if(index === 4) {
            done = res.done;
            if(!done) {
                ans = res.value;
            }
        }
        input = res.value;
        index = (index + 1) % phases.length;
    }
    return ans;
}

function* buildAmplifier(phase) {
    return yield* intCodeGen(program, inputFunction(phase));
}

const partTwoPossibilities = permutations([5,6,7,8,9]);

let maxPart2 = 0;

partTwoPossibilities.forEach(phases => {
    maxPart2 = Math.max(maxPart2, runProgramsPart2(phases));
});

console.log(maxPart2);