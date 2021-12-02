import { input } from "./input.js";

console.log(input[0]);

function travel({direction, distance}, { h, d }) {
    switch(direction) {
        case 'forward': return { h: h + distance, d};
        case 'up': return { h, d: d - distance };
        case 'down': return { h, d: d + distance };
        default: throw new Error(`Invalid arguments: ${arguments}`)
    }
}

const start = { h: 0, d: 0 };

const finish = input.reduce((loc, instruction) => travel(instruction, loc), start);

console.log(finish);

console.log(finish.h * finish.d);

function travel2({direction, distance}, { h, d, a }) {
    switch(direction) {
        case 'forward': return { h: h + distance, d: d + (a * distance), a};
        case 'up': return { h, d, a: a - distance };
        case 'down': return { h, d, a: a + distance };
        default: throw new Error(`Invalid arguments: ${arguments}`)
    }
}

const start2 = { h: 0, d: 0, a: 0 };

const finish2 = input.reduce((loc, instruction) => travel2(instruction, loc), start2);

console.log(finish2);

console.log(finish2.h * finish2.d);