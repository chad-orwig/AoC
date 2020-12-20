import input, {testInput} from './input.js';
import dfs from '../dfs.js';
import { MatchDirections } from './tile.js';

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

let remainingTiles = input.length;

function isComplete({tiles, order}) {
    if(tiles.length < remainingTiles) {
        remainingTiles = tiles.length;
        // console.log(order);
    }
    return !tiles.length;
}

const initialState = {
    tiles: input,
    grid : [[]],
    order: [],
}

const pt1 = dfs(initialState, nextStates, isComplete);
console.log(input.length);
if(pt1) {
    const max = pt1.grid.length - 1;
    const corners = [
        pt1.grid[0][0].parent.id,
        pt1.grid[0][max].parent.id,
        pt1.grid[max][max].parent.id,
        pt1.grid[max][0].parent.id,
    ]
    console.log(corners.reduce((a,b) => a * b));
    
}