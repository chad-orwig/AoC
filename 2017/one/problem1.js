const input = require('./input1');
const _ = require('lodash');

function sumMatches(input) {
    const filtered = _.filter(input, (letter, index, word) => {
        const checkLocation = (index +(word.length/2)) % word.length;
        return letter === word.charAt(checkLocation);
    });

    return _.sum(filtered.map(Number));

}

console.log(sumMatches('1212'));
console.log(sumMatches('1221'));
console.log(sumMatches('123425'));
console.log(sumMatches('123123'));
console.log(sumMatches('12131415'));
console.log(sumMatches(input));