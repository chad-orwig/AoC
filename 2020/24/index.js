import input, {test} from './input.js';
import {tap} from '../utils.js';

const directions = {
    e : [0, 1],
    w : [0, -1],
    ne: [-1, 1],
    sw: [1, -1],
    nw: [-1, 0],
    se: [1, 0],
}
function readDirectionArray(directionArray) {
    return directionArray.map(d => directions[d])
        .reduce((d1, d2) => [d1[0] + d2[0], d1[1] + d2[1]]);
}

function seedNeighbors(map, y, x) {
    Object.values(directions)
        .map(d => `${y + d[0]},${x + d[1]}`)
        .forEach(key => {
            if(!map.has(key)) map.set(key,false)
        });
}

const flipTile = (map) => ([y, x]) => {
    const key = `${y},${x}`;
    if(map.has(key)){
        const isBlack = !map.get(key)
        map.set(key, isBlack)
        if(isBlack) seedNeighbors(map, y, x);
    }
    else {
        map.set(key, true);
        seedNeighbors(map, y, x);
    }
}

function part1() {
    const map = new Map();

    input.map(readDirectionArray)
        .forEach(flipTile(map));
    
    return map;
}

const countNeighbors = (map) => (y,x) => {
    return Object.values(directions)
        .map(([ny,nx]) => `${ny + y},${nx + x}`)
        .filter(s => map.get(s))
        .length;
}

function keyToArray(key) {
    return key.split(',')
        .map(Number);
}

const shouldFlip = (map) => ([y,x,isBlack]) => {
    const blackNeighbors = countNeighbors(map)(y,x);
    return isBlack ? 
        blackNeighbors === 0 || blackNeighbors > 2 :
        blackNeighbors === 2;
}

function gameOfLifeRound(map, numRepitions, flipTester = shouldFlip(map), flipper = flipTile(map)) {
    
    if(numRepitions === 0) return map;
    [...map.entries()]
        .map(([key, isBlack]) => [...keyToArray(key), isBlack])
        .filter(flipTester)
        .forEach(flipper);

    console.log([...map.values()].filter(b => b).length);
    return gameOfLifeRound(map, numRepitions - 1, flipTester, flipper);
}
const map = part1();

console.log([...map.values()].filter(b => b).length);

gameOfLifeRound(map, 100);
