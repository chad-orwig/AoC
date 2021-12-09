import { input, testInput } from "./input.js";

/**
 * 
 * @param {number} rowNum 
 * @param {number} colNum 
 * @param {number[][]} array 
 * @param {number} fallback 
 * @returns {Array<{rowNum: number, colNum: number, height: number}>}
 */
function findNeighbors(rowNum, colNum, array, fallback = -1) {
    return [
        { rowNum, colNum: colNum - 1 },
        { rowNum, colNum: colNum + 1 },
        { rowNum: rowNum - 1, colNum},
        { rowNum: rowNum + 1, colNum},
    ]
    .map(({rowNum, colNum}) => ({
        rowNum,
        colNum,
        height : (array?.[rowNum]?.[colNum] ?? fallback)
    }));
}

const lowPoints = input
    .flatMap((row, rowNum) => row.map((height, colNum) => ({rowNum, colNum, height }))
    .filter(({rowNum, colNum, height}) => 
        findNeighbors(rowNum, colNum, input, height + 1)
            .every(({height: value}) => height < value)
));
const sum = lowPoints
    .map(({height}) => height)
    .reduce((a,b) => a + b);
console.log(sum + lowPoints.length);

/**
 * 
 * @param {Array<{rowNum, colNum, height}>} edges 
 * @param {*} array 
 * @param {Map<number,Set<number>>} seen 
 * @param {*} size 
 */
function findBasin(edges, array, seen = new Map(), size = 0) {
    
    const uniqEdges = edges.filter(({rowNum, colNum}) => {
        const colSet = seen.get(rowNum) ?? new Set();
        if(colSet.has(colNum)) return false;
        colSet.add(colNum);
        seen.set(rowNum, colSet);
        return true;
    });

    const newSize = uniqEdges.length + size;

    const newEdges = uniqEdges.flatMap(({rowNum, colNum}) => 
        findNeighbors(rowNum, colNum, array, 9)
            .filter(({height}) => height < 9))
            .filter(({rowNum, colNum}) => !seen.has(rowNum) || !seen.get(rowNum).has(colNum));
    if(newEdges.length === 0) return newSize;
    return findBasin(newEdges, array, seen, newSize);
}

const basins = lowPoints.map(point => findBasin([point], input))

console.log(basins.sort((a,b) => b - a).slice(0,3).reduce((a,b) => a * b))