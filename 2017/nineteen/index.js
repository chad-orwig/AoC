const input = require('./input');
const _ = require('lodash');

function findStart(row) {
    for(let i = 0; i < row.length; i++) {
        if(row[i] !== ' ') {
            return i;
        }
    }
}

const directionalInfo = {
    'd' : {
        travelOffset : {
            col : -1,
            row : 0
        },
        turns : ['l', 'r']
    },
    'u' : {
        travelOffset: {
            col : 1,
            row : 0
        },
        turns : ['l', 'r']
    },
    'l' : {
        travelOffset : {
            col : 0,
            row : -1
        },
        turns : ['u', 'd']
    },
    'r' : {
        travelOffset : {
            col : 0,
            row : 1
        },
        turns : ['u', 'd']
    }
};

function canGo(direction, map, row, col) {
    const offset = directionalInfo[direction].travelOffset;
    return map[row + offset.row] && map[row + offset.row][col + offset.col] && map[row + offset.row][col + offset.col] !== ' '
}

function go(direction, row, col) {
    const offset = directionalInfo[direction].travelOffset;
    return {
        direction,
        row        : offset.row + row,
        col        : offset.col + col
    }
}

function travel(direction, map, row, col) {
    if(canGo(direction, map, row, col)) {
        return go(direction, row, col)
    }
    else {
        const newDirection = _.find(directionalInfo[direction].turns, turn => canGo(turn, map, row, col));
        if(newDirection) {
            return go(newDirection, row, col);
        }
    }
}

function isLetter(char) {
    return char !== ' ' && char !== '|' && char !== '+' && char !== '-';
}

let direction = 'd';
let row = 0;
const letters = [];
let col = findStart(input[0]);
let steps = 0;

while(true) {
    steps++;
    const char = input[row][col];
    if(isLetter(char)) {
        letters.push(char);
    }
    const results = travel(direction, input, row, col);
    if(results) {
        direction = results.direction;
        row = results.row;
        col = results.col;
    }
    else {
        break;
    }
}

console.log(letters.join(''));
console.log(steps);
