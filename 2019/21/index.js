const input = require('./input');
const intCode = require('../intCode');

const part1Script = 
    `NOT A J
    NOT B T
    OR T J
    NOT C T
    OR T J
    AND D J
    WALK
    `;

function* scriptInput(script) {
    for(let i = 0; i < script.length; i++) {
        yield script.charCodeAt(i);
    }
}

const program = intCode(input, scriptInput(part1Script));

const outputs = [];

for(let output of program) {
    outputs.push(output);
}

if(outputs[outputs.length - 1] > 255) {
    console.log(outputs[outputs.length - 1]);
} else {
    const msg = outputs.map(code => String.fromCharCode(code))
    .join('');
    console.log(msg);
}