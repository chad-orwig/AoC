import input from './input.js';

const withBuiltIn = [...input, input[input.length - 1] + 3];

const diffs = withBuiltIn.map((num, i, arr) => {
    const compare = arr[i-1] || 0;
    return num - compare;
});

console.log(diffs);

const pt1 = diffs.reduce((ans, diff) => {
    switch(diff) {
        case 1:
            ans[1] += 1;
            break;
        case 3:
            ans[3] += 1;
            break;
    }
    return ans;
}, { 
    '1': 0,
    '3': 0
});
console.log(pt1)
console.log(pt1[1] * pt1[3]);

function directPaths(val, index, array) {
    return [3,2,1]
        .map((i) => index - i)
        .filter(i => i >=0 && val - array[i] <= 3);
}

function pathsToIndex({answerMap}, directPaths, index, array) {
    if(!directPaths.length) return { answerMap, numPaths: 1};
    if(answerMap.has(index)) return { answerMap, numPaths: answerMap.get(index)};

    const numPaths = directPaths
        .map(childIndex => pathsToIndex({ answerMap}, array[childIndex], childIndex, array ).numPaths)
        .reduce((a,b) => a + b);
        
    answerMap.set(index, numPaths);
    
    return { answerMap, numPaths }
}

const withZero = [0, ...withBuiltIn];


const { numPaths } = withZero
    .map(directPaths)
    .reduce(pathsToIndex, { answerMap: new Map()});

console.log(numPaths);



