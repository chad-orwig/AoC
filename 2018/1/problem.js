const input = require('./input');

const set = new Set();

let index = 0;
let sum = 0;

while(true) {
    if(set.has(sum)) {
        console.log(sum);
        break;
    }
    else {
        set.add(sum);
        sum += input[index];
        index++;
        if(index >= input.length) {
            index = 0;
        }
    }
}