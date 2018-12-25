const {target} = require('./input');

const cache = {};

function findIndexWithCache(x, y, levelFinder) {
    const annotation = `${x},${y}`;
    cache[annotation] = cache[annotation] || findIndex(x, y, levelFinder);

    return cache[annotation];

}

function findIndex(x, y, levelFinder) {
    if(x === 0 && y === 0) {
        return 0;
    }
    if(x === target.x && y === target.y) {
        return 0;
    }
    if(y === 0) {
        return x * 16807;
    }
    if(x === 0) {
        return y * 48271;
    }

    return levelFinder(x - 1, y) * levelFinder(x, y - 1);
}

module.exports = findIndexWithCache;