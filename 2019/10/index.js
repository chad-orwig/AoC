const {input, test} = require('./input');
const {Maps} = require('../../utils');

const SPACE = '.';
const ASTEROID = '#';

const source = input;
const maxRadius = Math.ceil(Math.sqrt(Math.pow(source.length, 2) + Math.pow(source[0].length, 2)));

function buildMap() {
    const map = new Map();
    const setCoordinates = Maps.mapCoordinateSetter(map);
    const getCoordinates = Maps.mapCoordinateGetter(map);
    for(let y = 0; y < source.length; y++) {
        for(let x = 0; x < source[y].length; x++) {
            if(source[y][x] === ASTEROID) {
                setCoordinates([x, y], { x, y });
            }
        }
    }
    return {
        map,
        setCoordinates,
        getCoordinates,
        deleteCoordinates : Maps.mapCoordinateDeleter(map),
        mapSize : Maps.mapCoordinateSize(map)
    };
}

function checkLine(x, y, rise, run, radius, map, getCoordinates) {
    let asteroidsInLine = [];
    for(let blockRadius = 1; blockRadius * radius < maxRadius; blockRadius++) {
        const blockRun = run * blockRadius;
        const blockRise = rise * blockRadius;
        const blockedLoc = getCoordinates([x + blockRun, y + blockRise]);
        if(blockedLoc) {
            asteroidsInLine.push(blockedLoc);
        }
    }

    return asteroidsInLine;
}

function asteroidCount(x,y, map, getCoordinates) {
    if(!getCoordinates([x,y])) {
        throw `No asteroid at ${x}, ${y}`;
    }

    const seenAndBlocked = new Set([getCoordinates([x,y])]);
    const seen = new Set();
    let seenCount = 0;

    for(let radius = 1; radius < maxRadius; radius++) {
        for(let run = radius; run >= radius * -1; run--) {
            const runAbs = Math.abs(run);
            let riseSet = [radius - runAbs];
            if(riseSet[0]) riseSet.push(runAbs - radius);
            riseSet.forEach(rise => {
                asteroidsInLine = checkLine(x, y, rise, run, radius, map, getCoordinates);
                if(asteroidsInLine[0] && !seenAndBlocked.has(asteroidsInLine[0])) {
                    seenCount++;
                    seen.add(asteroidsInLine[0]);
                }
                asteroidsInLine.forEach(seenAndBlocked.add.bind(seenAndBlocked));
            });

        }
    }

    return {seenCount, seen};
}

function destroyComparator({x : sx, y: sy}) {
    return({x:a1x, y:a1y }, { x:a2x, y:a2y }) => {
        const rise1 = a1y - sy;
        const run1 = a1x - sx;

        const rise2 = a2y - sy;
        const run2 = a2x - sx;
        return  Math.atan2(run2, rise2) - Math.atan2(run1, rise1);
    }
}

const {map, setCoordinates, getCoordinates, deleteCoordinates, mapSize} = buildMap();

let maxSeen = 0;
let baseLoc;

map.forEach((subMap, x) => {
    subMap.forEach((asteroid, y) => {
        const {seenCount} = asteroidCount(x, y, map, getCoordinates);
        if(seenCount > maxSeen) {
            baseLoc = asteroid;
            maxSeen = seenCount;
        }
    });
});

console.log(maxSeen);
console.log(baseLoc);

const destroyed = [];
const comparator = destroyComparator(baseLoc);
while(mapSize() > 1) {
    const {seen:destroyedThisLoop} = asteroidCount(baseLoc.x, baseLoc.y, map, getCoordinates);
    const sorted = Array.from(destroyedThisLoop)
        .sort(comparator);
    destroyed.push(...sorted);
    sorted.forEach(({x,y}) => deleteCoordinates([x,y]));
}
console.log(destroyed[199]);