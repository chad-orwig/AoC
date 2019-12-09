const input = require('./input');
const intCode = require('../intCode');
const test = [3,0,4,0,99];
for(let value of intCode(input, 1)) {
    console.log(value);
}
for(let value of intCode(input, 5)) {
    console.log(value);
}