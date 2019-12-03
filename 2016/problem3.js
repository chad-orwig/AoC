const input = require('./problem3Input');
const _ = require('lodash');

let validCount = 0;

function isValid([a, b, c]) {
    //console.log(`${a} ${b} ${c}`)
    return (a + b) > c;
}

input.forEach(line => {
    if(!line) {
        return;
    }
   const numArray = _.orderBy(line.map(Number));
   if(isValid(numArray)) {
       validCount ++;
   }
});

console.log(validCount);