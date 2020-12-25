import input from './input.js';

let value = 1;

const subject = 7;

function loop(value, subject) {
    const temp = value * subject;
    return temp % 20201227;
}

let iterations = 0;
while (value !== 4707356) {
    iterations++;
    value = loop(value,7);
}
// loop = 12413864
console.log(iterations);

value = 1;
for(let i = 0; i < 12413864; i++) {
    value = loop(value,12092626);
}

console.log(value);