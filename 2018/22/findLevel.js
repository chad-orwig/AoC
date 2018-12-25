const findIndex = require('./findIndex');
const {depth} = require('./input');

const cache = {};

function findLevelWithCache(x, y) {
    const annotation = `${x},${y}`;
    cache[annotation] = cache[annotation] || findLevel(x, y);
    return cache[annotation];
}

function findLevel(x, y) {
    return (findIndex(x, y, findLevelWithCache) + depth) % 20183;
}

module.exports = findLevelWithCache;