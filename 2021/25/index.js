import { input, testInput } from './input.js';
import utils from '../../utils.js';

const { Maps } = utils;

const east = '>';
const south = 'v';

function readInput(input) {
    const eastMovers = new Map();
    const eastSetter = Maps.mapCoordinateSetter(eastMovers);
    const southMovers = new Map();
    const southSetter = Maps.mapCoordinateSetter(southMovers);
    const rows = input.split('\n')
        .map(rowStr => rowStr.split(''));

    const maxY = rows.length - 1;
    const maxX = rows[0].length - 1;
    rows.forEach((row, y) => row
        .forEach((v, x) => {
            switch(v) {
                case east:
                    eastSetter([y,x], v);
                    break;
                case south:
                    southSetter([x,y], v);
                    break;
                default: //do nothing
            }
        }));
    return { eastMovers, southMovers, maxY, maxX };
}
/**
 * 
 * @param {Map<number, Map<number, '>'>>} eastMovers 
 * @param {Map<number, Map<number, 'v'>>} southMovers 
 */
function doMove(eastMovers, southMovers, maxX, maxY) {
    const southGetter = Maps.mapCoordinateGetter(southMovers);
    const newEastMovers = new Map();
    const newEastSetter = Maps.mapCoordinateSetter(newEastMovers);
    let moveCount = 0;
    for(const [y, row] of eastMovers.entries()) {
        for(const x of row.keys()) {
            const xTarget = x === maxX ? 0 : x + 1;
            const newX = row.has(xTarget) || southGetter([xTarget, y]) ? x : xTarget;
            newEastSetter([y,newX], east);
            if(newX === xTarget) moveCount++;
        }
    }
    const newEastGetter = Maps.mapCoordinateGetter(newEastMovers);

    const newSouthMovers = new Map();
    const newSouthSetter = Maps.mapCoordinateSetter(newSouthMovers);
    for(const [x, col] of southMovers.entries()) {
        for(const y of col.keys()) {
            const yTarget = y === maxY ? 0 : y + 1;
            const newY = (col.has(yTarget) || newEastGetter([yTarget, x])) ? y : yTarget;
            newSouthSetter([x,newY], south);
            if(newY === yTarget) moveCount++;
        }
    }

    return { southMovers: newSouthMovers, eastMovers: newEastMovers, moveCount};
}

let { southMovers, eastMovers, maxX, maxY } = readInput(input);
let step = 0;
let moveCount = Infinity;

function print(eastMovers, southMovers, maxX, maxY) {
    const eastGetter = Maps.mapCoordinateGetter(eastMovers);
    const southGetter = Maps.mapCoordinateGetter(southMovers)
    const str = new Array(maxY + 1).fill(0)
        .map((_, y) => new Array(maxX + 1).fill('.')
            .map((dot, x) => eastGetter([y,x]) ?? southGetter([x,y]) ?? dot)
            .join('')
        ).join('\n');
    console.log(str);
    
}
// print(eastMovers, southMovers, maxX, maxY);

while(moveCount > 0) {
    step++;
    const result = doMove(eastMovers, southMovers, maxX, maxY);
    moveCount = result.moveCount;
    southMovers = result.southMovers;
    eastMovers = result.eastMovers;
    // console.log(step);
    // print(eastMovers, southMovers, maxX, maxY);
}

console.log(step);