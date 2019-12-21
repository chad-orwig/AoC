const input = require('./input');
const intCode = require('../intCode');

function* scriptInput(script) {
    for(let i = 0; i < script.length; i++) {
        yield script.charCodeAt(i);
    }
}

function checkScript(script) {
    const program = intCode(input, scriptInput(script));

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
}

const part1Script = 
    `NOT A J
    NOT B T
    OR T J
    NOT C T
    OR T J
    AND D J
    WALK
    `;

const part2Script = 
    `NOT A J
    NOT B T
    OR T J
    NOT C T
    OR T J
    AND D J
    NOT E T
    NOT T T
    OR H T
    AND T J
    RUN
    `;

checkScript(part1Script);
checkScript(part2Script);