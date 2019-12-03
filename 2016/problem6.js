const input = require('./problem6Input').inputSplit;
const _ = require('lodash');

let start =[];
const mostCommon = _.chain(input)
    .reduce((current, word) => {
        _.forEach(word, (letter, index) => {
            if(current[index]) {
                current[index] = current[index] + letter;
            }
            else {
                current[index] = letter;
            }
        });
        return current;
    }, start)
    .map(mostCommonLetter)
    .value();

console.log(mostCommon.join(''));

function mostCommonLetter(word) {
    return _.chain(word)
        .countBy()
        .toPairs()
        .minBy(pair => pair[1])
        .value()[0];
}
