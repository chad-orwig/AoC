import { input } from './input.js';
import utils from '../../utils.js';
/**
 * @typedef {import('./input').PipeType} PipeType
 */

const { Maps } = utils;

const map = new Map();

const setter = Maps.mapCoordinateSetter(map);
const getter = Maps.mapCoordinateGetter(map);

const loop = [];

input.forEach(tile => {
  if (tile.type === 'start') loop.push(tile);
  setter([tile.col, tile.row], tile);
});

/**
 * @typedef { 'north' | 'south' | 'east' | 'west' } Direction
 * @param {[Direction, { type: PipeType }]} param0 
 * @returns {boolean}
 */
const connectedNeighbor = (([dir, {type} ]) => {
  if(type === 'start') return true;
  switch(dir) {
    case 'north': return type.includes('south');
    case 'south': return type.includes('north');
    case 'east': return type.includes('west');
    case 'west': return type.includes('east');
  }
});

const inverseDirMap = {
  north: 'south',
  south: 'north',
  east: 'west',
  west: 'east',
};
const buildNeighborsFn = (getter) => (tile) => {
  const {col, row} = tile;
  return [
    ['west', getter([col - 1, row])],
    ['east', getter([col + 1, row])],
    ['north', getter([col, row - 1])],
    ['south', getter([col, row + 1])],
  ].filter(([_, tile]) => tile)
  .filter(n => connectedNeighbor(n) && connectedNeighbor([inverseDirMap[n[0]], tile]))
  .map(([_, t]) => t);
};

const neighbors = buildNeighborsFn(getter);

let prev = loop[0];
let next = neighbors(loop[0])[0];
while(next !== loop[0]) {
  loop.push(next);
  next = neighbors(next).filter((neighbor) => neighbor !== prev)[0];
  prev = loop[loop.length - 1];
}
console.log(loop.length /2);

const loopSet = new Set(loop);

const leftLoopSet = new Set();
const rightLoopSet = new Set();

const directionOfTravel = (prev, cur) => {
  if (prev.row < cur.row) return 'south';
  if (prev.row > cur.row) return 'north';
  if (prev.col < cur.col) return 'east';
  if (prev.col > cur.col) return 'west';
}

const findLeft = (dir, {col, row, type}) => {
  switch (dir) {
    case 'north': return type === 'south-east' ? [getter([col - 1, row]), getter([col, row - 1])] : [getter([col - 1, row])];
    case 'south': return type === 'north-west' ? [getter([col + 1, row]), getter([col, row + 1])] : [getter([col + 1, row])];
    case 'east': return type === 'south-west' ? [getter([col, row - 1]), getter([col + 1, row])] : [getter([col, row - 1])];
    case 'west': return type === 'north-east' ? [getter([col, row + 1]), getter([col - 1, row])] : [getter([col, row + 1])];
  }
  throw new Error('woops');
}

const findRight = (dir, {col, row, type}) => {
  switch (dir) {
    case 'north': return type === 'south-west' ? [getter([col + 1, row]), getter([col, row - 1])] : [getter([col + 1, row])];
    case 'south': return type === 'north-east' ? [getter([col - 1, row]), getter([col, row + 1])] : [getter([col - 1, row])];
    case 'east': return type === 'north-west' ? [getter([col, row + 1]), getter([col + 1, row])]: [getter([col, row + 1])];
    case 'west': return type === 'south-east' ? [getter([col, row - 1]), getter([col - 1, row])] : [getter([col, row - 1])];
  }
  throw new Error('woops');
}

const findPotentials = (prev, cur) => {
  const dir = directionOfTravel(prev,cur);
  return [findLeft(dir, cur), findRight(dir, cur)];
}

const isPotential = (t) => t && !loopSet.has(t) && !leftLoopSet.has(t) && !rightLoopSet.has(t);

loop.slice(1).forEach((t,i) => {
  const [left, right] = findPotentials(loop[i], t);
  const leftPotentials = left.filter(isPotential);
  while(leftPotentials.length) {
    const p = leftPotentials.pop();
    leftLoopSet.add(p);
    if(leftLoopSet.has(getter([0,0]))) {console.log(t); throw new Error()}
    const { col, row } = p;
    const newPotentials = [
      getter([col-1, row-1]),
      getter([col-1, row]),
      getter([col-1, row+1]),
      getter([col+1, row-1]),
      getter([col+1, row]),
      getter([col+1, row+1]),
      getter([col, row-1]),
      getter([col, row+1]),
    ].filter(isPotential);
    leftPotentials.push(...newPotentials);
  }

  const rightPotentials = right.filter(isPotential);
  while(rightPotentials.length) {
    const p = rightPotentials.pop();
    rightLoopSet.add(p);
    const { col, row } = p;
    const newPotentials = [
      getter([col-1, row-1]),
      getter([col-1, row]),
      getter([col-1, row+1]),
      getter([col+1, row-1]),
      getter([col+1, row]),
      getter([col+1, row+1]),
      getter([col, row-1]),
      getter([col, row+1]),
    ].filter(isPotential);
    rightPotentials.push(...newPotentials);
  }
});

const newMap = new Map();
const newSetter = Maps.mapCoordinateSetter(newMap);

input.forEach((n) => {
  if (loopSet.has(n)) newSetter([n.col, n.row], n.symbol);
  else if(leftLoopSet.has(n)) newSetter([n.col, n.row], 'I');
  else if(rightLoopSet.has(n)) newSetter([n.col, n.row], 'O');
});
Maps.mapCoordinate2DPrint(newMap)(s => s)();
if(leftLoopSet.has(getter([0,0]))) console.log(rightLoopSet.size)
else console.log(leftLoopSet.size);