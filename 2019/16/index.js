const _ = require('lodash');
const input = require('./input');
const {Maps} = require('../../utils');
const math = require('mathjs');
const base = [0,1,0,-1];

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

function runRowPt2(waste, n, arr) {
    const patternSize = 4 * (n + 1);
    const leftover = actualSize % patternSize;
    const numRuns = Math.floor(actualSize / (arr.length + leftover));
    const part1 = runRow(null, n, [...arr, ...arr.slice(0, leftover)]).sum;
    const part2 = leftover ? runRow(null, n, arr.slice(arr.length - leftover)).sum : 0;

    return Math.abs((part1 * numRuns) + part2) % 10;
}

function runRow3(n,arr, offset){
    let sum = 0;
    const blockSize = n + 1 + offset;
    let blockIndex = offset;
    let block = 0 ;
    let i = 0;
    while(i < arr.length){
        blockIndex++;
        if(blockIndex === blockSize) {
            blockIndex = 0;
            block++;
            if(block === 4) {
                block = 0;
            }
        }
        const amountToTake = Math.min(blockSize - blockIndex, arr.length - i);
        if(block !== 0 && block !== 2) {
            let val = arr.slice(i,i + amountToTake)
                .reduce((a,b) => a + b, 0);
            if(block === 1) sum += val;
            else sum -= val;
        }
        i+=amountToTake;
        blockIndex += amountToTake - 1;
    }
    const ans =  Math.abs(sum) % 10;
    return {ans, sum};
}

const baseMap = new Map();

function runRow2(n, arr, offset) {
    const base = baseMap.has(n) ? baseMap.get(n) : baseMap.set(n,createBase(n + offset, arr.length, offset)).get(n)
    const sum = math.multiply(base, arr);

    const ans =  Math.abs(sum) % 10;
    return {ans, sum};
}

function runRow1(n, arr) {
    const sum = arr.reduce(rowReducer, {
        n,
        blockSize : n + 1,
        block : 0,
        blockIndex : 0,
        sum : 0
    }).sum;
    
    const ans =  Math.abs(sum) % 10;
    return {ans, sum};
}

function runRow(n, arr, offset) {
    return runRow2(n, arr, offset);    
}

function runPhasePart2(arr) {
    const ans = arr
        .map(runRowPt2);

    ans.str = ans.join('');
    return ans;
}

function runPhase(arr, offset = 0) {
    const ans = arr
        .map((waste, n, arr) => runRow(n,arr, offset))
        .map(({ans}) => ans);
    return ans;
}

function doTheRoundingThing(n) {
    return Math.abs(n) % 10;
}

function createBase(row, size, offset = 0) {
    let blockIndex = offset;
    let index = 0;
    let block = 0;
    const arr = new Array(size);
    while(index < size) {
        blockIndex++;
        if(blockIndex === row + 1) {
            blockIndex = 0;
            block++;
            if(block === 4) {
                block = 0;
            }
        }
        const amountToTake = Math.min(row + 1 - blockIndex, size - index)
        arr.fill(base[block], index, index + amountToTake);
        index+= amountToTake;
        blockIndex += amountToTake - 1;
    }
    return arr;
}

// let arr = [1,2,3,4,5,6,7,8];
let arr = input;

for(let i = 0; i < 100; i++) {
    arr = runPhase(arr);
}

console.log(arr.slice(0,8).join(''));
//03036732577212944063491565474664
// let part2 = '0303673257721294406349156547466403036732577212944063491565474664'
//     .split('').map(Number);
    
// console.log(part2.join(''));
// for(let i = 0; i < 2; i++) {
//     part2 = runPhase(part2);
//     console.log(part2.join(''));
// }


// let part2Scaled = '03036732577212944063491565474664'.split('').map(Number);
// console.log(part2Scaled.join(''));
// for(let i = 0; i < 2; i++) {
//     part2Scaled = runPhase(part2Scaled, 1);
//     console.log(part2Scaled.join(''));
// }

let testInput = '03036732577212944063491565474664'

// const part2Input = testInput.split('')
//     .map(Number);
const part2Input = input;

// let b = math.matrix(_.range(0,mat.length).map(n => createBase(n, mat.length)));

// mat = math.multipl(mat, 2);


// console.log(math.multiply(b, mat).toArray().map(doTheRoundingThing).join(''));

baseMap.clear();
const offset =  5971981;
// const offset = 303673;
const length = part2Input.length * 10000;
const leftover = offset % part2Input.length;
const numDups = Math.floor((length - offset) / part2Input.length);

let part2 =[];
while(length - part2.length > offset) {
    part2.push(...part2Input);
}
while(length - part2.length < offset) {
    part2.shift();
}

console.log(length - part2.length)

// console.log(createBase(offset, part2.length, offset).join(''));


// let b = math.matrix(_.range(0,mat.length).map(n => createBase(n, mat.length)), 'sparse');
// let b = new Array(mat.length)
//     .fill(1)
//     .map((v, i) => createBase(i, mat.length));

// console.log(b[0]);


for(let i = 0; i < 100; i++) {
    // mat = math.multiply(b, mat).toArray().map(doTheRoundingThing);
    console.time('phase');
    let sum = part2.reduce((a,b) => a+ b, 0);
    part2 = part2.map((val, index, arr) => {
        const temp = sum;
        sum -= val;
        return temp % 10;
    });
    console.timeEnd('phase');
}

console.log(part2.slice(0, 8).join(''));
