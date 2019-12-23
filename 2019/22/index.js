const input = require('./input');
const sortBy = require('lodash/fp/sortBy');
const range = require('lodash/fp/range');
const findIndex = require('lodash/fp/findIndex');

function newStack(deck) {
    return deck.reverse();
}

function cut(deck, num) {
    const n = num < 0 ? deck.length + num : num;
    return deck.slice(n).concat(deck.slice(0, n));
}

function dealWithIncrement(deck, increment) {
    let oldIndex = 0;
    let newIndex = 0;
    const newDeck = new Array(deck.length);
    while(oldIndex < deck.length) {
        newDeck[newIndex] = deck[oldIndex];
        newIndex += increment;
        if(newIndex >= deck.length) {
            newIndex -= deck.length;
        }
        oldIndex++;
        
    }
    return newDeck;
}

function readCommand(commands) {
    return (arr) => {
        const words = arr
            .filter(str => !Number(str))
            .join(' ');
        const command = commands[words];
        if(!command) throw `no command named ${words}`;
        const arg = arr
            .map(Number)
            .filter(val => val)[0];

        return { command, arg, name: arr.join(' ') };
    }
}

function commandReducerPart1(deck, {command, arg, name}, index) {
    return command.call(deck, deck, arg)
}

const part1Commands = {
    'cut' : cut,
    'deal into new stack' : newStack,
    'deal with increment' : dealWithIncrement
}

const shuffle = input.map(s => s.split(' '))
    .map(readCommand(part1Commands));

const deck = shuffle.reduce(commandReducerPart1,range(0, 10007, 1));

console.log(deck.length);
console.log(findIndex(val=> val === 2019)(deck));

function positionBeforeCut(deckLength, positionAfter, cutAmount) {
    let positionBefore = positionAfter + cutAmount;
    if(positionBefore > deckLength) {
        positionBefore -= deckLength;
    } 
    else if (positionBefore < 0) {
        positionBefore += deckLength;
    }

    return positionBefore;
}

function positionBeforeNewStack(deckLength, positionAfter) {
    return deckLength - positionAfter - 1;
}

function positionBeforeDealWithIncrement(deckLength, positionAfter, increment) {
    return ((deckLength * positionAfter * x)) / increment % deckLength;
}

const part2Commands = {
    'cut' : positionBeforeCut,
    'deal into new stack' : positionBeforeNewStack,
    'deal with increment' : positionBeforeDealWithIncrement
}

const part2Shuffle = input
    .map(str => str.split(' '))
    .map(readCommand(part2Commands))
    .reverse();

const part2 = part2Shuffle.reduce((previousPosition, {command, arg}) => command(10007, previousPosition, arg), 7096);

console.log(part2);

const testSize = 123
const testIndex = 32;
const testIncrement = 37
const test = dealWithIncrement(range(0,testSize), testIncrement);
console.log(test[testIndex]);

console.log(positionBeforeDealWithIncrement(testSize, testIndex, testIncrement));
