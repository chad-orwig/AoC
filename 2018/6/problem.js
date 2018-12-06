const input = require('./input');
const _ = require('lodash');
const grid = [];

for(let x = input.minX; x <= input.maxX; x++) {
    const currentRow = [];
    grid.push(currentRow);
    for(let y = input.minY; y <= input.maxY; y++) {
        const closest = determineClosest(x, y);
        currentRow.push(closest);
    }
}

for(let i = 0; i < grid.length; i++) {
    const row = grid[i];
    if(i === 0 || i === (grid.length - 1)) {
        filterRow(row);
    }
    else {
        filterNode(row[0]);
        filterNode(row[row.length - 1]);
        row.forEach(countOne);
    }
}

const notFiltered = input.arr.filter(node => !node.isFiltered);
const max = _.maxBy(notFiltered, 'count');

console.log(max);

function countOne(node) {
    if(node) {
        node.count = (node.count || 0) + 1;
    }
}

function filterRow(row) {
    row.forEach(filterNode);
}

function filterNode(node) {
    if(node) {
        node.isFiltered = true;
    }
}

function determineClosest(x, y) {
    const groups = _.groupBy(input.arr, distanceFromPointFunction(x,y))
    const minDistance = _.min(Object.keys(groups).map(Number));
    if(groups[minDistance].length === 1) {
        return groups[minDistance][0];
    }
    else {
        return null;
    }
}

function distanceFromPointFunction(x, y) {
    return (node) => Math.abs(x - node.x) + Math.abs(y - node.y);
}