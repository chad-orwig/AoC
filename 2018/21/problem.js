const _ = require('lodash')
const ipReg = 3;
let ip = 0;
const registers = [0,0,0,0,0,0];
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
const reg1Set = new Set();
const reg1List = [];
while(true) {
    registers[ipReg] = ip;
    if(ip === 30) {
        if(reg1Set.has(registers[4])) {
            break;
        }
        else {
            reg1Set.add(registers[4]);
            reg1List.push(registers[4]);
            if(reg1List.length % 100 === 0) {
                console.log(registers[4]);
            }
        }

    }
    execute(registers, program[ip]);
    ip = registers[ipReg] + 1;
    counter ++;
}

console.log(reg1List[reg1List.length - 1]);

function makeAnAttempt(a) {
    console.log(`making attempt on ${a}`);
    attempt = a;
    reset();
    let found = true;
    while(ip >= 0 && ip < program.length) {
        registers[ipReg] = ip;
        execute(registers, program[ip]);
        ip = registers[ipReg] + 1;
        counter ++;
        if(counter === 50000000) {
            found = false;
            break;
        }
    }

    if(found) {
        console.log(counter);
    }
    return {
        attempt,
        result : found && counter
    };
}


function reset(){
    counter = 0;
    ip = 0;
    registers[0] = attempt;
    registers[1] = 0;
    registers[2] = 0;
    registers[3] = 0;
    registers[4] = 0;
    registers[5] = 0;
}
