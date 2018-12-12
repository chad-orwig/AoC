const {rules, stateInput} = require('./input');
const _ = require('lodash');
const state = {};
state.minIndex = 0;
_.forEach(stateInput, (indicator, index) => {
   state[index] = indicator;
});
state.maxIndex = stateInput.length - 1;


function grow() {
    let currentBehavior = '.....';
    let newMax = 0,
        newMin = 0;
    // let string = '';
    for(let i = state.minIndex - 2; i <= state.maxIndex + 2; i++) {
        currentBehavior = currentBehavior.slice(1) + (state[i + 2] || '.');
        const newBehavior = rules[currentBehavior];
        state[i] = newBehavior;
        // string = string + newBehavior;
        if(newBehavior === '#') {
            if(i > state.maxIndex) {
                newMax = Math.max(newMax, i);
            }
            if(i < state.minIndex) {
                newMin = Math.min(newMin, i);
            }
        }
    }
    if(newMin) {
        state.minIndex = newMin;
    }
    if(newMax) {
        state.maxIndex = newMax;
    }
    // console.log(string);

}

_.range(20).forEach(() => grow());

// // for(let i = 0; i < 50; i++) {
// //     console.log('billion');
// //     for(let j = 0; j < 1000; j++) {
//         for(let k = 0; k < 1000000; k++) {
//             console.log(`${k} - ${sum()}`);
//             grow();
//         }
// //     }
// // }
// let oldSum = 0;
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