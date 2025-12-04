import { input } from './input';

const rollSymbol = '@';
interface Coordinate {
  row: number;
  col: number;
};

const rolls = input.split('\n')
  .map((line) => {
    const arr: string[] = [];
    for(let i = 0; i < line.length; i++) {
      if(line.charAt(i) === rollSymbol) {
        arr[i] = rollSymbol;
      }
    }
    return arr;
  });

const neighborCount = ({row, col}: Coordinate) => {
  return [
    rolls[row-1]?.[col-1],
    rolls[row-1]?.[col],
    rolls[row-1]?.[col+1],
    rolls[row+1]?.[col-1],
    rolls[row+1]?.[col],
    rolls[row+1]?.[col+1],
    rolls[row]?.[col-1],
    rolls[row]?.[col+1],
  ].filter((c) => c === rollSymbol).length;
}

const buildCoords = () => rolls.flatMap((row, rowIndex) => {
  return row.map((col, colIndex) => {
    return {row: rowIndex, col: colIndex};
  }).filter((coord) => rolls[coord.row]?.[coord.col] === rollSymbol);
});

let coords = buildCoords();

const p1 = coords
  .map(neighborCount)
  .filter((count) => count < 4)
  .length;

console.log(p1)

const removeAccessibleRolls = (coords: Coordinate[]) => {
  const toRemove = coords
  .filter((coord) => neighborCount(coord) < 4);

  toRemove.forEach(({ row, col }) => delete rolls[row]?.[col]);

  return toRemove.length;
}

let totalRemoved = 0;
let removed = removeAccessibleRolls(coords);

while(removed > 0) {
  totalRemoved += removed;
  coords = buildCoords();
  removed = removeAccessibleRolls(coords);
}

console.log(totalRemoved);