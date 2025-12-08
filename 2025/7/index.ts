import { input } from './input';

const map = input.split('\n').map((line) => line.split(''));

const startCol = map[0]?.findIndex((cell) => cell === 'S') as number;

let row = 0;
const row1 = [];
row1[startCol] = true;
const allBeams: boolean[][] = [row1];
let p1 = 0;
while(row < map.length) {
  row++;
  const beams = (allBeams[allBeams.length - 1] ?? [])
    .map((_v, i) => {
      const arr = [];
      if(map[row]?.[i] === '^') {
        p1++;
        arr[i - 1] = true;
        arr[i + 1] = true;
      }
      else arr[i] = true;
      return arr;
    })
    .reduce((acc, cur) => {
      cur.forEach((v, i) => {
        if(v) acc[i] = true;
      });
      return acc;
    }, [] as boolean[]);
  allBeams.push(beams);
}

console.log(p1);

const memo: Record<string, number> = {};

const numPaths = (row:number, col:number): number => {
  if(!allBeams[row]?.[col]) return 0;
  if(row === 0) return 1;
  const key = `${row},${col}`;
  if(memo[key]) return memo[key];
  const ans = numPaths(row - 1, col) +
    (map[row]?.[col - 1] === '^' ? numPaths(row - 1, col - 1) : 0) + 
    (map[row]?.[col + 1] === '^' ? numPaths(row - 1, col + 1) : 0);
  memo[key] = ans;
  return ans;
}

const lastRow = allBeams.length - 1;

const p2 = (allBeams[lastRow] as boolean[])
  .map((v, i) => numPaths(lastRow, i))
  .reduce((acc, cur) => acc + cur, 0);

console.log(p2);