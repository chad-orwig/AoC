const input = require('./input');
const intCode = require('../intCode');
const test = [3,0,4,0,99];
for(value of intCode(input, 1)) {
    console.log(value);
}
for(value of intCode(input, 5)) {
    console.log(value);
}