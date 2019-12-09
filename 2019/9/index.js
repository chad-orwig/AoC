const input = require('./input');
const intCode = require('../intCode');

const program = intCode(input, 1);

for(let output of program) {
    console.log(output);
}

const part2 = intCode(input, 2);

for(let output of part2) {
    console.log(output);
}