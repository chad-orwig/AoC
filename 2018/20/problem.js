const {Room, rooms} = require('./Room');
const input = require('./input');
const bfs = require('../../bfs');
const _ = require('lodash');

const start = new Room();
let index = 0;
let current = start;
const parentQueue = [];
let minX = 0,
    maxX = 0,
    minY = 0,
    maxY = 0;

function calcMinsAndMax(room) {
    minX = Math.min(room.x, minX);
    maxX = Math.max(room.x, maxX);
    minY = Math.min(room.y, minY);
    maxY = Math.max(room.y, maxY);
}

while(index < input.length) {
    const instruction = input[index];
    switch (instruction) {
        case 'E' :
        case 'W' :
        case 'N' :
        case 'S' :
            next = current.travel(instruction);
            current = next;
            calcMinsAndMax(current);
            break;
        case '(' :
            parentQueue.push(current);
            break;
        case ')' :
            current = parentQueue.pop();
            break;
        case '|' :
            current = parentQueue[parentQueue.length - 1];
            break;
    }
    index ++;
}

const missingRooms = new Set(Object.values(rooms));
missingRooms.delete(start);


function nextStates(current, currentSteps) {
    const room = rooms[current];
    room.steps = room.steps || currentSteps;
    const nextRooms = _.filter([room.N, room.S, room.E, room.W]);
    nextRooms.forEach(r => {
        missingRooms.delete(r);
        r.steps = r.steps || currentSteps + 1;
    });
    return nextRooms.map(r => r.toString());
}

function heuristic() {
    return missingRooms.size;
}

const result = bfs(start.toString(), nextStates, heuristic);

console.log(result);

console.log(Object.values(rooms).filter(r => r.steps >= 1000).length);