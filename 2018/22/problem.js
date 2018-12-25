const _ = require('lodash');
const findLevel = require('./findLevel');
const {target} = require('./input');
const bfs = require('../../bfs');
const typeCache = {};
let risk = 0;

for(let x = 0; x <= target.x; x++) {
    for(let y = 0; y <= target.y; y++) {
        risk += findType(x, y);
    }
}

console.log(risk);

function nextStates({x, y, time, equipment}) {
    const walkTime = time + 1;
    const equipTime = time + 7;
    const baseWalk = { x, y, time : walkTime, equipment };
    const baseEquip = { x, y, time: equipTime};

    const possibilities = [
        Object.assign({}, baseWalk, { x : x + 1}),
        Object.assign({}, baseWalk, { x : x - 1}),
        Object.assign({}, baseWalk, { y : y + 1}),
        Object.assign({}, baseWalk, { y : y - 1}),
        Object.assign({equipment : 'none'}, baseEquip),
        Object.assign({equipment : 'torch'}, baseEquip),
        Object.assign({equipment : 'gear'}, baseEquip)
    ];

    return possibilities.filter(stateIsValid);
}

function stateToString({x, y, equipment}) {
    return JSON.stringify({x, y, equipment});
}

function getTime({state}) {
    return state.time;
}

function insertSortedByMinutes(queue, state) {
    queue.splice(_.sortedIndexBy(queue, state, getTime), 0, state);
}

function stateIsValid({x, y, equipment}) {
    if((x < 0) || (y < 0)) {
        return false;
    }

    switch (equipment) {
        case 'torch':
            if(findType(x, y) === typeMap.wet) return false;
            break;

        case 'gear' :
            if(findType(x, y) === typeMap.narrow) return false;
            break;

        case 'none' :
            if(findType(x, y) === typeMap.rocky) return false;
            break;

    }

    return true;
}

const typeMap = {
    rocky : 0,
    wet   : 1,
    narrow: 2
};

function findType(x, y) {
    const annotation = `${x},${y}`;
    typeCache[annotation] = typeCache[annotation] || (findLevel(x, y) % 3);

    return typeCache[annotation];
}

function manhattan({x, y, equipment}) {
    return Math.abs(target.x - x) + Math.abs(target.y - y) + (equipment !== 'torch' ? 1 : 0);
}

function customWriteThrough(visited, state) {
    const stringified = stateToString(state);
    const prevTime = visited[stringified];
    if((prevTime === undefined) || (state.time < prevTime) ) {
        visited[stringified] = state.time;
        return true;
    }

    return false;
}

const result = bfs({
    x : 0,
    y : 0,
    time : 0,
    equipment : 'torch'
}, nextStates, manhattan, null, customWriteThrough, insertSortedByMinutes);

//1082 low
//1089 too high...1087 is correct
console.log(result);

