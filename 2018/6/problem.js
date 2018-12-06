const input = require('./input');
const _ = require('lodash');
const grid = [];

for(let x = input.minX; x <= input.maxX; x++) {
    const currentRow = [];
    grid.push(currentRow);
    for(let y = input.minY; y <= input.maxY; y++) {
        const withenDistance = withinDistance(x,y, 10000);
        currentRow.push(withenDistance);
    }
}
const rowSums = grid.map(row => _.filter(row).length);
const area = _.sum(rowSums);

console.log(area);

function withinDistance(x, y, distance) {
    const distanceFunction = distanceFromPointFunction(x,y);
    const distances = input.arr.map(distanceFunction);
    const distanceSum = _.sum(distances);
    return distanceSum <= distance;
}

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