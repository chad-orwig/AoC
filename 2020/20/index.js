import input, {testInput} from './input.js';
import dfs from '../dfs.js';
import { MatchDirections } from './tile.js';

import { rotateSquare, rotateSquareMapper } from '../utils.js';

function nextStates({tiles, grid, order }) {
    const numRows = grid.length;
    const topRowLength = grid[0].length;

    let rowIndex = numRows > topRowLength ? 0 : grid.findIndex(row => row.length < topRowLength);
    if(rowIndex === -1) {
        rowIndex = grid.length;
        grid.push([]);
    }
    const colIndex = grid[rowIndex].length;

    const newOrder = [...order, `${rowIndex}, ${colIndex}`];

    const neighborAbove = grid[rowIndex - 1]?.[colIndex];
    const leftNeighbor = grid[rowIndex][colIndex - 1];

    const potentialMatch = (variant) => 
        (!neighborAbove || neighborAbove.matches(variant, MatchDirections.TopToBottom)) &&
        (!leftNeighbor || leftNeighbor.matches(variant, MatchDirections.LeftToRight));

    return tiles
        .flatMap(tile => tile.variants)
        .filter(potentialMatch)
        .map(variant => newState(tiles, grid, variant, rowIndex, newOrder));
}

function newState(oldTiles, oldGrid, variantToAdd, rowIndex, order) {
    const tiles = oldTiles
        .filter(tile => tile !== variantToAdd.parent);
    const newRow = [...oldGrid[rowIndex], variantToAdd];

    const grid = oldGrid.map((row, index) => index === rowIndex ? newRow : row);

    return { tiles, grid, order };
}

function isComplete({tiles}) {
    return !tiles.length;
}

const initialState = {
    tiles: input,
    grid : [[]],
    order: [],
}

function toRotatedPicture(variant) {
    const flipped = !variant.flipped ? variant.parent.grid.map(row => [...row].reverse()) : variant.parent.grid;
    const rotated = rotateSquare(flipped, variant.rotations);

    return rotated.map(row => row.join(''));
}

const pt1 = dfs(initialState, nextStates, isComplete);
const max = pt1.grid.length - 1;
const corners = [
    pt1.grid[0][0].parent.id,
    pt1.grid[0][max].parent.id,
    pt1.grid[max][max].parent.id,
    pt1.grid[max][0].parent.id,
]
console.log(corners.reduce((a,b) => a * b));


const variantGrid = pt1.grid
    .map(row => row.map(toRotatedPicture));

const innerRowCount = variantGrid[0][0].length;
let pictureGrid = variantGrid.flatMap(tileRow => [...Array(innerRowCount).keys()]
        .map(i => tileRow.map(picture => picture[i]).join(''))
    ).map(str => str.split(''))
    .map(row => [...row].reverse())
    .map(rotateSquareMapper)


const seaMonsterOffsets = 
`                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `
    .split('\n')
    .map(str => str.split(''))
    .flatMap((row, rowOffset) => row.map((col, colOffset) => col === '#' ? { rowOffset, colOffset} : null))
    .filter(offset => offset !== null);

const { maxRow, maxCol } = seaMonsterOffsets.reduce(({maxRow, maxCol }, {rowOffset, colOffset}) => ({maxRow: Math.max(maxRow, rowOffset), maxCol: Math.max(maxCol, colOffset)}), { maxRow: 0, maxCol: 0})

function checkSeaMonster(offsets, grid, row, col) {
    const letters = offsets.map(({rowOffset, colOffset}) => grid[row + rowOffset]?.[col + colOffset]);

    return letters.every(l => l === '#')
    
}

let seaMonsterCount = 0;
for(let row = 0; row < pictureGrid.length; row++) {
    for(let col = 0; col < pictureGrid[0].length; col++) {
        if(checkSeaMonster(seaMonsterOffsets, pictureGrid, row, col)) {
            seaMonsterCount++;
        }
    }
}

console.log(checkSeaMonster(seaMonsterOffsets, pictureGrid, 16, 1))
// console.log(seaMonsterOffsets);
pictureGrid.forEach(row => console.log(row.join('')));
console.log(seaMonsterCount);
const choppyCount = pictureGrid.flat().filter(l => l === '#').length - (seaMonsterCount * seaMonsterOffsets.length);

console.log(choppyCount);

