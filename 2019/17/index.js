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

function comboMatch(comboA, comboB) {
    if(comboA.length === comboB.length) {
        const match = comboA.reduce((goodSoFar, instruction, index) => goodSoFar && instruction === comboB[index], true);
        return match;
    }
}

function matchedInstructionReducer(instructions) {
    return (match, combo, index, instructionSet) => {
        if(match) return match;
        if(comboMatch(combo, instructions.slice(0, combo.length))) {
            const set = findInstructionSet(instructionSet, instructions.slice(combo.length));
            if(set) set.path.push(index);
            return set;
        }
    }
}

function makeInstructionString(instructions) {
    return instructions.map(i => i.toString()).join(',');
}

function addInstructionReducer(instructionSet) {
    return (match, waste, index, instructions) => {
        if(match) return match;
        const newInstruction = instructions.slice(0, index + 1);
        if(makeInstructionString(newInstruction).length > 20) return 'too long';
        const success = findInstructionSet([...instructionSet, newInstruction], instructions.slice(index + 1));
        if(success) {
            success.path.push(instructionSet.length);
            return success;
        }
    }
}

function findInstructionSet(instructionSet, instructions) {
    if(instructions.length === 0) {
        instructionSet.path = [];
        return instructionSet;
    }
    const matchedSet = instructionSet.reduce(matchedInstructionReducer(instructions), false);
    if(matchedSet) return matchedSet;

    if(instructionSet.length < 3) {
        const addInstructionWorks = instructions.reduce(addInstructionReducer(instructionSet), undefined);
        if(addInstructionWorks !== 'too long') {
            return addInstructionWorks;
        }
    }
}

function printPath(path) {
    return path.map(v => {
        switch(v) {
            case 0: return 'A';
            case 1: return 'B';
            case 2: return 'C';
        }
    }).join(',');
}

const instructionSet = findInstructionSet([], instructions);
instructionSet.path = instructionSet.path.reverse();
console.log(printPath(instructionSet.path));
instructionSet.map(makeInstructionString).forEach(s => console.log(s));


function* inputFunction() {
    const path = printPath(instructionSet.path);
    const instructions = instructionSet.map(makeInstructionString).join('\n');
    const commands = `${path}\n${instructions}\nn\n`;
    console.log(commands);
    for(let i = 0; i < commands.length; i++) {
        yield commands.charCodeAt(i);
    }
}

const part2 = intCode([2, ...input.slice(1)], inputFunction());

let dust;
for(let output of part2) {
    dust = output;
}

console.log(dust);