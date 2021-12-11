import { input } from "./input.js";

const neighborRange = [-1, 0, 1]

const neighborOffsets = neighborRange.flatMap(rO => 
    neighborRange.map(cO => [ rO, cO ]))
    .filter(([rO, cO]) => rO !== 0 || cO !== 0);


function findNeighbors(row, col, numRows = 10, numCols = 10) {
    return neighborOffsets
        .map(([rO, cO]) => [row + rO, col + cO])
        .filter(([rO]) => rO >= 0 && rO < numRows)
        .filter(([_rO, cO]) => cO >= 0 && cO < numCols);
}

/**
 * 
 * @param {number[][]} octoMap
 * @param {boolean[][]} flashed
 * @param {number} count
 */
function handleFlashes(octoMap, flashed=[], count=0) {
    const newFlashers = octoMap
        .flatMap((row, rowI) => 
            row.map((energy, colI) => ({ energy, rowI, colI})))
        .filter(({energy}) => energy > 9)
        .filter(({rowI, colI}) => !(flashed?.[rowI]?.[colI]));
    if(!newFlashers.length) {
        const finalOctoMap = octoMap.map((row, rowI) => row.map((e, colI) => {
            if(flashed?.[rowI]?.[colI]) return 0;
            return e;
        }));
        return { finalOctoMap, count }
    }
    newFlashers.forEach(({rowI, colI}) => {
        const arr = flashed?.[rowI] ?? [];
        arr[colI] = true;
        flashed[rowI] = arr;
        const neighbors = findNeighbors(rowI, colI);
        neighbors.forEach(([rowI, colI]) => octoMap[rowI][colI]++);
    });

    return handleFlashes(octoMap, flashed, count + newFlashers.length);

}
/**
 * 
 * @param {number[][]} octoMap 
 */
function octoStep(octoMap, iterations, flashCount = 0) {
    if(iterations === 0) return {octoMap, flashCount};
    const add1 = octoMap.map(row => row.map(col => col + 1));
    const { finalOctoMap, count: newFlashCount} = handleFlashes(add1);
    return octoStep(finalOctoMap, iterations - 1, newFlashCount + flashCount);
}

console.log(octoStep(input, 100).flashCount)

let step = 0;
let numFlashes = 0;
let octoMap = input;

while(numFlashes !== 100) {
    step++;
    const stepResults = octoStep(octoMap, 1);
    numFlashes = stepResults.flashCount;
    octoMap = stepResults.octoMap;
}

console.log(step);