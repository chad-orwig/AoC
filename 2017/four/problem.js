const input = require('./input');
const _ = require('lodash');
const valid = _.filter(input,(wordArray => {
    const sortedWords = wordArray.map(word =>{
        const letters = _.sortBy(word);
        return letters.join('');
    });
    debugger;
    const unique = _.uniq(sortedWords);

    return unique.length === wordArray.length;
}));

console.log(valid.length);