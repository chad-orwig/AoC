"use strict";
let input = require('./input');
//let input = [0, 2, 7, 0];
const _ = require('lodash');

const seenValues = {};

let steps = 0;

function redistribute(index, banks) {
    const val = banks[index];
    const smallAmount = Math.floor(val / banks.length);
    const largeAmount = smallAmount + 1;
    const numSmall = banks.length - (val % banks.length);

    banks[index] = 0;
    let count = 0;
    let i = index;
    while(count < banks.length) {
        banks[i] += count < numSmall ? smallAmount : largeAmount;
        i = (i + banks.length - 1) % banks.length;
        count ++;

    }
}

function rebalance(banks) {
    let max = 0;
    let index = 0;
    _.forEach(banks, (val, i) => {
        if (val > max) {
            max = val;
            index = i;
        }
    });

    redistribute(index, banks);
}

while(!seenValues[JSON.stringify(input)]) {
    seenValues[JSON.stringify(input)] = true;
    rebalance(input);
    steps ++;
    console.log(JSON.stringify(input));
}

console.log(steps);

const lookingFor = JSON.stringify(input);
steps = 0;
while(true) {
    rebalance(input);
    steps ++;
    const stringVal = JSON.stringify(input);
    console.log(stringVal);
    if(stringVal === lookingFor) {
        break;
    }
}
console.log(steps);