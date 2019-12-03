const input = require('./input');
const mproc = require('./mproc');


let index0 = 0;

const registers0 = {a: 1};

const queue0 = [];
queue0.id = 0;

const queue1 = [];
queue1.id = 1;

while(true) {
    if (0 <= index0 && index0 < input.length) {
        const result = mproc.programCycle(index0, registers0, input, queue0, queue1);
        if (result === undefined) {
            index0++;
        }
        else {
            index0 += result;
        }
    }
    else {
        break;
    }
}

console.log(mproc.getMulCounter());
console.log(registers0.h);