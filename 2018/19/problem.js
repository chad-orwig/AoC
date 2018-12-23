const ipReg = 4;
let ip = 0;
const registers = [1,0,0,0,0,0];
const input = require('./input');
const operations = require('../16/operations');
operations(registers);
const program = input.map(parseInstruction);

function parseInstruction(text) {
    const arr = text.split(' ');
    return {
        cmd : arr[0],
        args : arr.slice(1).map(Number)
    };
}

function execute(registers, {cmd, args}) {
    registers[cmd](...args);
}

let counter = 0;
while(ip >= 0 && ip < program.length) {
    registers[ipReg] = ip;
    if(counter === 100000) {
        console.log(ip);
        console.log(JSON.stringify(registers));
        counter = 0;
    }
    execute(registers, program[ip]);
    ip = registers[ipReg] + 1;
    counter ++;
}
console.log(registers[0]);

