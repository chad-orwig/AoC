import bfs from '../../bfs/index.js';
import { input, testInput } from './input.js';
import utils from '../../utils.js';
import 'colors';
import { promisify } from 'util';

const delay = promisify(setTimeout);


const { Maps } = utils;


const memoizedGetLoc = (() => {
    const locMap = new Map();
    const getter = Maps.mapCoordinateGetter(locMap);
    const setter = Maps.mapCoordinateSetter(locMap);
    return (x, y) => {
        const loc = getter([x,y]) ?? ({ x, y });
        setter([x,y], loc);
        return loc;
    }
})();

let cavernRisk = input;
/**
 * @typedef {{ y: number, x: number }} Loc
 * @typedef {{
 *   totalRisk: number,
 *   loc: Loc,
 *   distanceFromHome: number
 * }} RiskState
 * @type {RiskState}
 */
const startingState = {
    totalRisk: 0,
    loc: memoizedGetLoc(0, 0),
    distanceFromHome: distanceFromHome({ x: 0, y: 0})
};

/**
 * 
 * @param {RiskState} state
 * @returns {RiskState[]}
 */
function findNextStates(state) {
    return [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ]
    .map(([x, y]) => ({
        x : x + state.loc.x,
        y : y + state.loc.y,
    }))
    .map(({x, y}) => ({ loc: memoizedGetLoc(x,y), risk: cavernRisk?.[y]?.[x]}))
    .filter(({risk}) => risk)
    .map(({ loc,risk}) => ({
        loc: loc,
        totalRisk: state.totalRisk + risk,
        distanceFromHome: distanceFromHome(loc),
        prev: state
    }));
    
}

/**
 * @type Set<Loc>
 */
let seenSet;
let routes = [];
let nextLog = Promise.resolve();
const keepFunction = () => {
    const seen = new Set();
    seenSet = seen;
    /**
     * @param {number} bestSeenDistance
     * @param {number} currentDistance
     * @param {RiskState} state
     * @returns {boolean}
     */
    return (bestSeenDistance, currentDistance, state) => {
        if(currentDistance - bestSeenDistance > 799) return false;
        const key = state.loc;
        if(seen.has(key)) return false;
        seen.add(key);
        const {x,y} = key;
        const row = routes?.[y] ?? [];
        routes[y] = row;
        row[x] = ' '.bgRed;
        if(seen.size % 10000 === 0) {
            const routeString = routes.map(row => row.map(v => v || ' ').join('')).join('\n');
            nextLog = nextLog.then(() => delay(2000)).then(() => console.log(routeString));
        }
        return true;
    }
}
/**
 * @param {Loc} loc,
 * @returns {number};
 */
function distanceFromHome(loc) {
    const d = (cavernRisk.length - 1 - loc.y) + (cavernRisk[0].length - 1 - loc.x);
    return d;
}

const ans = bfs(startingState, findNextStates, (state) => state.distanceFromHome, keepFunction(), JSON.stringify, (state) => state.totalRisk)

console.log(ans);

const reCalcRisk = (x,y, cavern) => cavern.map(row => row.map(col => col + x + y).map(col => col > 9 ? col - 9 : col))

const p2 = [
    [cavernRisk, cavernRisk, cavernRisk, cavernRisk, cavernRisk],
    [cavernRisk, cavernRisk, cavernRisk, cavernRisk, cavernRisk],
    [cavernRisk, cavernRisk, cavernRisk, cavernRisk, cavernRisk],
    [cavernRisk, cavernRisk, cavernRisk, cavernRisk, cavernRisk],
    [cavernRisk, cavernRisk, cavernRisk, cavernRisk, cavernRisk],
].map((row, rowI) => row.map((col, colI) => reCalcRisk(colI, rowI, col)))
.flatMap(rowOfGrids => rowOfGrids.reduce((gridA,gridB) => gridA.map((gridRow, gridRowNum) => [...gridRow, ...gridB[gridRowNum]])))

cavernRisk = p2;

routes = new Array(500).fill(0).map(() => [[' ']]);
const ans2 = bfs(startingState, findNextStates, (state) => state.distanceFromHome, keepFunction(), (state) => state.loc, (state) => state.totalRisk);

// console.log(ans2);



let routePath = ans2[0].state;

while(routePath) {
    const {x, y} = routePath.loc;
    routes[y][x] = ' '.bgGreen;
    routePath = routePath.prev;
}
const routeString = routes.map(row => row.map(v => v || ' ').join('')).join('\n');
nextLog.then(() => delay(2000)).then(() => console.log(routeString));
