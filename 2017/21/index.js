const input = require('./input');
const utils = require('./blockUtils');

let arr = utils.stringToArray('.#./..#/###');

function cycle(arr) {
    const slices = utils.slice(arr);
    const replaced = slices.map(slice => {
        const sliceString = utils.arrayToString(slice);
        const replaceString = input[sliceString];
        if(!replaceString) {
            throw 'no replace string found';
        }
        return utils.stringToArray(replaceString);
    });
    const merged = utils.merge(replaced);
    return merged;
}

for(let i = 0; i < 18; i++) {
    arr = cycle(arr);
}
let sum = 0;
arr.forEach(row => {
    row.forEach(val => {
        if(val === '#') {
            sum++;
        }
    })
});

console.log(sum);