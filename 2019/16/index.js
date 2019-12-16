const _ = require('lodash');
const input = require('./input');
const {Maps} = require('../../utils');

const fullAnsMap = new Map();
const rowMap = new Map();
const rowGetter = Maps.mapCoordinateGetter(rowMap);
const rowSetter = Maps.mapCoordinateSetter(rowMap);

function rowReducer(current, val, index) {
    
    current.blockIndex++;
    if(current.blockIndex === current.blockSize) {
        current.blockIndex = 0;
        current.block++;
        if(current.block === 4) {
            current.block = 0;
        }
    }
    switch(current.block) {
        case 0:
        case 2:
            break;
        case 1:
            current.sum += val;
            break;
        case 3:
            current.sum -= val;
            break;
    }
    return current;
}

function runRow(waste, n, arr) {
    const memoized = rowGetter([arr.str, n]);
    if(memoized === 0 || memoized) {
        console.log('row match');
        return memoized;
    }
    const sum = arr.reduce(rowReducer, {
        n,
        blockSize : n + 1,
        block : 0,
        blockIndex : 0,
        sum : 0
    }).sum;
    
    const ans =  Math.abs(sum) % 10;
    rowSetter([arr.str, n], ans);
    return ans;
}

function runPhase(arr, offset = 0) {
    const memoized = fullAnsMap.get(arr.str)
    if(memoized) {
        console.log('phase match');
        return memoized;
    }
    const ans = arr.map(runRow);
    ans.str = ans.join('');
    fullAnsMap.set(arr.str, ans);
    return ans;
}

// let arr = [1,2,3,4,5,6,7,8];
let arr = input;
arr.str = arr.join('');

for(let i = 0; i < 100; i++) {
    arr = runPhase(arr);
}

console.log(arr.slice(0,8).join(''));

