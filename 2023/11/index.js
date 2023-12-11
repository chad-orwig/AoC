import { input } from './input.js';

const emptyCols = input.arr[0]
  .map((_, col) => col)
  .filter((col) => !input.meta.nonEmptyCols.has(col));

const newRowLength = input.arr[0].length + emptyCols.length;
const emptyRow = () => new Array(newRowLength).fill('.');
const expandedArray = input.arr.reduce((arr, row, rowI) => {
  if (input.meta.emptyRows.includes(rowI)) arr.push(emptyRow(), emptyRow());
  else {
    const expandedRow = row.reduce((colArr, col, colI) => {
      if (emptyCols.includes(colI)) colArr.push(col);
      colArr.push(col);
      return colArr;
    }, []);
    arr.push(expandedRow);
  }
  return arr;
}, []);

const toGalaxies = (arr) => arr.flatMap((row, rowI) => row.map((symbol, colI) => ({ rowI, colI, symbol })))
  .filter(({symbol}) => symbol === '#');

const expandedGalaxies = toGalaxies(expandedArray);
const distance = (g1, g2) => Math.max(g1.rowI, g2.rowI) - Math.min(g1.rowI, g2.rowI) + Math.max(g1.colI, g2.colI) - Math.min(g1.colI, g2.colI);
const p1 = expandedGalaxies.flatMap((g1, i) => expandedGalaxies.slice(i + 1).map(g2 => distance(g1, g2)))
  .reduce((a,b) => a+b);

console.log(p1);

const expansionAmount = 999999;

const galaxies = toGalaxies(input.arr);

const p2 = galaxies.flatMap((g1, i) => galaxies.slice(i + 1).map(g2 => {
  const baseDistance = distance(g1, g2);
  const expandingRowCount = input.meta.emptyRows
    .filter(row => row > Math.min(g1.rowI, g2.rowI))
    .filter(row => row < Math.max(g1.rowI, g2.rowI))
    .length;
  
  const expandingColCount = emptyCols
    .filter(col => col > Math.min(g1.colI, g2.colI))
    .filter(col => col < Math.max(g1.colI, g2.colI))
    .length;

    return baseDistance + (expansionAmount * (expandingColCount + expandingRowCount))
})).reduce((a,b) => a + b);

console.log(p2);
