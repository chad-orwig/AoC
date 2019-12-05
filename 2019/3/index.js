const [wire1, wire2] = require('./input');

const intersection = require('lodash/intersection');
 
function moveRight({x, y}) {
    return {
        x : x + 1,
        y : y
    }
}

function moveLeft({x,y}) {
    return {
        x : x -1,
        y : y
    }
}

function moveUp({x,y}) {
    return {
        x,
        y : y + 1
    }
}

function moveDown({x,y}) {
    return {
        x,
        y : y - 1
    }
}

function findDistanceUpdater(direction) {
    switch(direction) {
        case 'R' : return moveRight;
        case 'L' : return moveLeft;
        case 'U' : return moveUp;
        case 'D' : return moveDown;
    }
}

function findLocations(foundLocations, [direction, ...distanceString]) {
    let prevLoc = foundLocations.length ? foundLocations[ foundLocations.length - 1] : { x:0, y:0 };
    const distance = Number(distanceString.join(''));;
    const distanceUpdater = findDistanceUpdater(direction);
    const locations = [ ...foundLocations];
    for(let i = 0; i < distance; i++) {
        prevLoc = distanceUpdater(prevLoc);
        locations.push(prevLoc);
    }

    return locations;
}

function manhattan({x, y}) {
    return Math.abs(x) + Math.abs(y);
}

function safeMin(a,b) {
    if (a !== 0 && !a) { return b; }
    if (b !== 0 && !b) { return a; }

    return Math.min(a,b);
}

const wire1Locs = wire1.reduce(findLocations, []).map(JSON.stringify);
const wire2Locs = wire2.reduce(findLocations, []).map(JSON.stringify);

const collisions = intersection(wire1Locs, wire2Locs);

const shortest = collisions
    .map(JSON.parse)
    .map(manhattan)
    .reduce(safeMin, undefined);

console.log(shortest);

const visitedW1 = {};
const visitedW2 = {};

for(let i = 0; i < Math.max(wire1Locs.length, wire2Locs.length); i++) {
    w1Loc = wire1Locs[i];
    if(visitedW2[w1Loc]) {
        console.log(visitedW2[w1Loc] + i + 1);
        break;
    }
    else {
        visitedW1[w1Loc] = visitedW1[w1Loc] || i + 1;
    }

    w2Loc = wire2Locs[i];
    if(visitedW1[w2Loc]) {
        console.log(visitedW1[w2Loc] + i + 1);
        break;
    }
    else {
        visitedW2[w2Loc] = visitedW2[w2Loc] || i + 1;
    }
}
