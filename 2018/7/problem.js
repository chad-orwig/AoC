const input = require('./input');
const _ = require('lodash');

const letterMap = {};

input.forEach(({parent, child}) => {
    const parentLetter = letterMap[parent] || new Letter(parent);
    const childLetter = letterMap[child] || new Letter(child);

    parentLetter.children.add(childLetter);
    childLetter.parents.add(parentLetter);

    letterMap[parent] = parentLetter;
    letterMap[child] = childLetter;
});

function Letter(char) {
    this.char = char;
    this.children = new Set();
    this.parents = new Set();
    this.time = char.charCodeAt(0) - 4;
    this.startTime = 0;
}

const readyLetters = _.chain(Object.values(letterMap))
    .filter(letter => !letter.parents.size)
    .sortBy('char')
    .value();

const usedLetters = [];

function useLetter() {
    const thisRound = [];
    for(let i = 0; i < 5; i++) {
        if(readyLetters.length) {
            thisRound.push(readyLetters.shift());
        }
    }
    thisRound.forEach(next => {
        next.children.forEach(child => {
            child.parents.delete(next);
            if(child.parents.size === 0) {
                child.startTime = next.startTime + next.time;
                readyLetters.splice(
                    _.sortedIndexBy(readyLetters, child, 'char'),
                    0, child
                );
            }
        });
        usedLetters.push(next);
    });
}

while(readyLetters.length) {
    useLetter();
}
const lastLetter = usedLetters[usedLetters.length - 1];
console.log(lastLetter.startTime + lastLetter.time);