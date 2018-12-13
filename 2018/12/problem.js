const {rules, stateInput} = require('./input');
const _ = require('lodash');
const moment = require('moment');
let state = {};
const start = moment();
state.minIndex = 0;
_.forEach(stateInput, (indicator, index) => {
   state[index] = indicator;
});
state.maxIndex = stateInput.length - 1;

function shouldGrow(index, state) {
    const ruleKey = (state[index - 2] || '.') +
        (state[index - 1] || '.') +
        (state[index] || '.') +
        (state[index + 1] || '.') +
        (state[index + 2] || '.');

    return rules[ruleKey] || '.';
}

function grow() {
    const nextState = {};
    _.forEach(state, (val, key) => {
        if(val === '#') {
            const index = Number(key);
            for(let i = index - 2; i <= index + 2; i++) {
                if(!nextState[i]) {
                    nextState[i] = shouldGrow(i, state);
                }
            }
        }
    });

    state = nextState;
}

// _.range(20).forEach(() => grow());


for(let i = 0; i < 50; i++) {
    for(let j = 0; j < 1000; j++) {
        console.log(`${j} million - ${moment().diff(start, 'minutes')} minutes`);
        for(let k = 0; k < 1000; k++) {
            for(let m = 0; m < 1000; m++) {
                grow();
            }
        }
    }
}


function sum() {
    let sum = 0;

    _.forEach(state, (val, key) => {
        if(val === '#') {
            sum += Number(key);
        }
    });
    return sum;
}


console.log(sum());