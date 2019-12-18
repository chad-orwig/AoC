const input = require('./input');
const intCode = require('../intCode');
const {Maps} = require('../../utils');
const orderBy = require('lodash/fp/orderBy');

const program = intCode(input);
const screen = new Map();
const getter = Maps.mapCoordinateGetter(screen);
const setter = Maps.mapCoordinateSetter(screen);
const printer = Maps.mapCoordinate2DPrint(screen)(v=>v);
const isScaffold = v => v==='#';
const countScaffold = Maps.mapCoordinateCountBy(screen)(isScaffold);

let x = 0;
let y = 0;
let start;
for(let output of program) {
    let character = String.fromCharCode(output);
    if(character === '\n'){
        x = 0;
        y++;
    } else {
        setter([x,y], character);
        if(character !== '#' && character !== '.'){
            start = {x,y};
        }
        x++;
    }
}

const intersections = [];

for(let[x, yMap] of screen) {
    for(let[y, character] of yMap) {
        if(
            character === '#' &&
            getter([x,y - 1]) === '#' &&
            getter([x,y + 1]) === '#' &&
            getter([x - 1,y]) === '#' &&
            getter([x + 1,y]) === '#'
        ){
            intersections.push({x,y});
        }
    }
}

const sum = intersections.reduce((current, {x,y}) => current + (x * y), 0);
printer();
console.log(sum);

function determineTurn({x, y, direction}) {
    const left = direction === 'right' || direction === 'up' ? -1 : 1;
    const right = left * -1;
    switch(direction) {
        case 'up':
        case 'down':
            return isScaffold(getter([x + left, y])) ? 'left' : 
                isScaffold(getter([x + right, y])) && 'right';
        case 'left':
        case 'right':
        return isScaffold(getter([x, y + left])) ? 'left' : 
            isScaffold(getter([x, y + right])) && 'right';
    }
}

const directions = ['up', 'right', 'down', 'left'];
const directionsMap = directions.reduce((m, v, i) => {
    m[v] = i;
    return m;
}, {});

function newDirection({direction, turn}) {
    const offset = turn === 'left' ? -1 : 1;
    const directionIndex = ((directionsMap[direction] + offset) + directions.length) % directions.length;
    return directions[directionIndex];
}

function countSteps({x, y, direction}) {
    const offset = direction === 'right' || direction === 'down' ? 1 : -1;
    const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
    const loc = {
        x,y
    };
    loc[axis] += offset;
    let steps = 0;
    while(isScaffold(getter([loc.x, loc.y]))) {
        steps++;
        loc[axis] += offset;
    }
    return {
        steps, axis, offset
    };
}

function Instruction(turn, step) {
    this.turn = turn;
    this.step = step;
}

const instructionMap = new Map();
const instructionMapGetter = Maps.mapCoordinateGetter(instructionMap);
const instructionMapSetter = Maps.mapCoordinateSetter(instructionMap);

Instruction.getInstruction = (turn, step) =>
    instructionMapGetter([turn, step]) || 
    (instructionMapSetter([turn,step], new Instruction(turn, step)) && instructionMapGetter([turn, step]));

Instruction.abbreviations = {
    left : 'L',
    right: 'R'
}

Instruction.prototype.toString = function() {
    return `${Instruction.abbreviations[this.turn]},${this.step}`;
}

const robot = {
    x : start.x,
    y : start.y,
    direction : 'up'
};

robot.turn = determineTurn(robot);
const instructions = [];
while(robot.turn) {
    robot.direction = newDirection(robot);
    const {steps, axis, offset} = countSteps(robot);
    instructions.push(Instruction.getInstruction(robot.turn, steps));
    robot[axis] += (steps * offset);
    robot.turn = determineTurn(robot);
}

console.log(instructions.map(i => i.toString()).join(',').length);

function mostCommonInstructionCombo(count, instructions) {
    const counter = new Map();
    const countSetter = Maps.mapCoordinateSetter(counter);
    const countGetter = Maps.mapCoordinateGetter(counter);
    let max = 0;
    let mostCommonCombo;
    instructions.forEach((instruction, index, array) => {
        if((index + count) < length) {
            const slice = array.slice(index, index + count);
            const currentCount = (countGetter(slice) || 0) + 1;
            countSetter(slice, currentCount);
            if(currentCount > max) {
                max = currentCount;
                mostCommonCombo = slice;
            }
        }
    });

    mostCommonCombo.comboCount = max;

    return mostCommonCombo;
}

function comboMatch(comboA, comboB) {
    if(combo.length === slice.length) {
        return combo.reduce((goodSoFar, instruction, index) => goodSoFar && instruction === slice[index], true);
    }
}

function inInstructionPool(pool, slice) {
    for(let i = 0; i < pool.length; i++) {
        const combo = pool[i];
        if(comboMatch(combo, slice)) return true;
    }
    return false;
}

