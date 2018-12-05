const input = require('./input');
const _ = require('lodash');

let twos = 0,
    threes = 0;

input.forEach((word) => {
    const counts = _.countBy(word);
    const valueSet = new Set(_.values(counts));
    if(valueSet.has(2)) {
        twos++;
    }
    if(valueSet.has(3)) {
        threes++;
    }
});

console.log(twos * threes);

function oneDifferent(word1, word2) {
    let difference = false;
    for(let i = 0; i < word1.length; i++) {
        const same = word1[i] === word2[i];

        if(!same) {
            if(difference) {
                return false;
            }
            else difference = true;
        }
    }
    return difference
}

for(let i = 0; i < input.length; i++) {
    for(let j = 0; j < input.length; j++) {
        if(oneDifferent(input[i], input[j])) {
            console.log(input[i]);
            console.log(input[j]);
            console.log(i);
            console.log(j);
            process.exit();
        }
    }
}