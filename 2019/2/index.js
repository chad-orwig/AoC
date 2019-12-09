const input = require('./input');
const test = [2,4,4,5,99,0];
const intCode = require('../intCode');
const { staticInputGenerator } = require('../../utils');

function* inputGenerator(noun, verb) {
    yield 
}

for(let noun = 0; noun <= 99; noun++) {
    for(let verb = 0; verb <= 99; verb++) {
        const thisProgram = [...input];
        thisProgram[1] = noun;
        thisProgram[2] = verb;
        const result = intCode(thisProgram).next().value;
        if(result === 19690720){
            console.log(100 * noun + verb);
        }
    }
}
