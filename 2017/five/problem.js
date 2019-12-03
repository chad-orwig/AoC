const input = require('./input');

let offset = 0;
let instructionCount = 0;

while(offset >=0 && offset < input.length) {
    let newOffset = input[offset] + offset;
    let growthAmount = input[offset] < 3 ? 1 : -1;
    input[offset] = input[offset] + growthAmount;
    instructionCount ++;

    offset = newOffset;
}

console.log(instructionCount);