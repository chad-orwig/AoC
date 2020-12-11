import input from './input.js';

const empty = 'L';
const floor = '.';
const filled = '#';

function neighbors(oldGrid, rowIndex, seatIndex) {
    return [
        oldGrid?.[rowIndex - 1]?.[seatIndex - 1] || empty,
        oldGrid?.[rowIndex - 1]?.[seatIndex] || empty,
        oldGrid?.[rowIndex - 1]?.[seatIndex + 1] || empty,
        oldGrid?.[rowIndex]?.[seatIndex - 1] || empty,
        oldGrid?.[rowIndex]?.[seatIndex + 1] || empty,
        oldGrid?.[rowIndex + 1]?.[seatIndex - 1] || empty,
        oldGrid?.[rowIndex + 1]?.[seatIndex] || empty,
        oldGrid?.[rowIndex + 1]?.[seatIndex + 1] || empty,
    ]
}

function shouldFill(oldGrid, rowIndex, seatIndex, neigbhorsFn, threshold) {
    return neigbhorsFn(oldGrid, rowIndex, seatIndex)
        .filter(seat => seat === filled)
        .length <= threshold;
}
function shouldEmpty(oldGrid, rowIndex, seatIndex, neigbhorsFn, threshold) {
    return neigbhorsFn(oldGrid, rowIndex, seatIndex)
        .filter(seat => seat === filled)
        .length >= threshold;
}

const seatChecker = (rowIndex, oldGrid, neigbhorsFn, fillThreshold, emptyThreshold) => (currentSeat, seatIndex) => {

    switch(currentSeat) {
        case floor: return floor;
        case empty: return shouldFill(oldGrid, rowIndex, seatIndex, neigbhorsFn, fillThreshold) ? filled : empty;
        case filled: return shouldEmpty(oldGrid, rowIndex, seatIndex, neigbhorsFn, emptyThreshold) ? empty: filled;
        default: throw new Error(`Unexpected Seat Type ${currentSeat} at ${rowIndex}, ${seatIndex}`);
    }
}

const tickReducer = (neighborsFn, fillThreshold=0, emptyThreshold=4) => function (newGrid, row, rowIndex, oldGrid) {
    newGrid[rowIndex] = row.map(seatChecker(rowIndex, oldGrid, neighborsFn, fillThreshold, emptyThreshold));
    return newGrid;
}

function countOccupied(grid) {
    return grid.flatMap(row => row)
        .filter(seat => seat === filled)
        .length;
}

let grid = input;
let lastCount = -1
let currentCount = 0;

while(lastCount !== currentCount) {
    lastCount = currentCount;
    grid = grid.reduce(tickReducer(neighbors), new Array(grid.length));
    currentCount = countOccupied(grid);
}
console.log(currentCount);

function findInDirection(rowMod, seatMod, grid, rowIndex, seatIndex) {
    const newRow = rowIndex + rowMod;
    const newSeat = seatIndex + seatMod;
    const val = grid?.[newRow]?.[newSeat];

    switch(val) {
        case undefined:
        case empty: return empty;
        case filled: return filled;
        case floor: return findInDirection(rowMod, seatMod, grid, newRow, newSeat);
    }
}

function pt2Neighbors(oldGrid, rowIndex, seatIndex) {
    return [
        findInDirection(-1, -1, oldGrid, rowIndex, seatIndex),
        findInDirection(-1, 0, oldGrid, rowIndex, seatIndex),
        findInDirection(-1, 1, oldGrid, rowIndex, seatIndex),
        findInDirection(0, -1, oldGrid, rowIndex, seatIndex),
        findInDirection(0, 1, oldGrid, rowIndex, seatIndex),
        findInDirection(1, -1, oldGrid, rowIndex, seatIndex),
        findInDirection(1, 0, oldGrid, rowIndex, seatIndex),
        findInDirection(1, 1, oldGrid, rowIndex, seatIndex),
    ]
}

grid = input;
lastCount = -1
currentCount = 0;

while(lastCount !== currentCount) {
    lastCount = currentCount;
    grid = grid.reduce(tickReducer(pt2Neighbors, 0, 5), new Array(grid.length));
    currentCount = countOccupied(grid);
}
console.log(currentCount);