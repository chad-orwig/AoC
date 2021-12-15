import bfs from '../../bfs/index.js';
import { input, testInput } from './input.js';

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
    loc: { x: 0, y: 0 },
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
    .map(({x, y}) => ({x, y, risk: cavernRisk?.[y]?.[x]}))
    .filter(({risk}) => risk)
    .map(({x,y,risk}) => ({
        loc: { x, y },
        totalRisk: state.totalRisk + risk,
        distanceFromHome: distanceFromHome({x,y})
    }));
    
}

const keepFunction = () => {
    const bestCostAtLoc = new Map();
    /**
     * @param {number} bestSeenDistance
     * @param {number} currentDistance
     * @param {RiskState} state
     * @returns {boolean}
     */
    return (bestSeenDistance, currentDistance, state) => {
        if(currentDistance - bestSeenDistance > 800) {
            // console.log(`Filtered out far away ${currentDistance}`);
            return false
        };
        const key = JSON.stringify(state.loc);
        const prevRisk = bestCostAtLoc.get(key) ?? state.totalRisk;
        const bestRisk = Math.min(prevRisk, state.totalRisk);
        bestCostAtLoc.set(key, bestRisk);
        return bestRisk === state.totalRisk;
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

const ans = bfs(startingState, findNextStates, (state) => state.distanceFromHome, keepFunction(), JSON.stringify, (state) => state.totalRisk + state.distanceFromHome)

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

const ans2 = bfs(startingState, findNextStates, (state) => state.distanceFromHome, keepFunction(), JSON.stringify, (state) => state.totalRisk + state.distanceFromHome);

console.log(ans2);