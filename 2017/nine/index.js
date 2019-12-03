const input = require('./input');
const _ = require('lodash');
function Group(parent) {
    this.children = [];
    if(parent) {
        this.parent = parent;
        this.score = this.parent.score + 1;
    }
    else {
        this.score = 1;
    }
}
const topGroup = new Group();

let currentGroup = topGroup;

let state = 'group';

let index = 1;

let garbageCount = 0;

function beginGarbageCommand() {
    state = 'garbage';
}

function closeGroupCommand() {
    currentGroup = currentGroup.parent;
}

function newGroupCommand() {
    const newGroup = new Group(currentGroup);
    currentGroup.children.push(newGroup);
    currentGroup = newGroup;
}

function interpretGroupCommand(char) {
    switch(char) {
        case '{' :
            return newGroupCommand;

        case '}' :
            return closeGroupCommand;

        case '<' :
            return beginGarbageCommand;

        case ',':
            return doNothing

        default :
            throw `Unable to interpret group command ${char}`;
    }
}

function skipCommand() {
    index ++;
}

function endGarbageCommand() {
    state = "group";
}

function doNothing() {
    //do nothing
}

function countGarbage() {
    garbageCount++;
}

function interpretGarbageCommand(char) {
    switch(char) {
        case '!' :
            return skipCommand;
        case '>' :
            return endGarbageCommand;
        default:
            return countGarbage
    }
}

function interpretCommand(char, state) {
    if(state === 'group') {
        return interpretGroupCommand(char);
    }
    return interpretGarbageCommand(char);
}

while (index < input.length) {
    const char = input.charAt(index);
    const command = interpretCommand(char, state);
    command();
    index++;
}

function calculateScore(group) {
    if(!group) {
        return 0;
    }
    const childrenScores = group.children.map(calculateScore);

    return _.sum(childrenScores) + group.score;
}

const score = calculateScore(topGroup);
console.log(topGroup);
console.log(score);
console.log(garbageCount);