const input = 'oundnydw';
const knotHash = require('../ten/knotHash');
const hexToBinary = require('hex-to-binary');
const _ = require('lodash');

let usedSum = 0;
const regions = [];

function mergeRegions(regionsToMerge) {
    const newRegion = Object.assign({}, ...regionsToMerge);
    _.pull(regions, ...regionsToMerge);
    regions.push(newRegion);
    return newRegion;
}

function newRegion(row, col) {
    const region = {};
    addToRegion(row, col, region);
    regions.push(region);
}

function addToRegion(row, col, region) {
    region[`${row},${col}`] = true;
}

function regionContains(row, col, region) {
    return region[`${row},${col}`];
}

function findAdjacentRegions(rowNum, colNum) {
    return _.filter(regions, region => {
        return regionContains(rowNum - 1, colNum, region) ||
            regionContains(rowNum + 1, colNum, region) ||
            regionContains(rowNum, colNum -1, region) ||
            regionContains(rowNum, colNum + 1, region);
    });
}

for(let row = 0; row < 128; row++) {
    const hex = knotHash(`${input}-${row}`);
    const binary = hexToBinary(hex);
    _.forEach(binary, (val, col) => {
        const isUsed = val === '1';
        if(isUsed) {
            usedSum++;
            const adjacentRegions = findAdjacentRegions(row, col);
            switch (adjacentRegions.length) {
                case 1:
                    addToRegion(row, col, adjacentRegions[0]);
                    break;
                case 0:
                    newRegion(row, col);
                    break;
                default:
                    const newR = mergeRegions(adjacentRegions);
                    addToRegion(row, col, newR);
                    break;
            }
        }
    });
}
console.log(usedSum);
console.log(regions.length);