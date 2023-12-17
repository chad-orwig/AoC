import { input } from './input.js';
import utils from '../../utils.js';

const { Maps } = utils;

/** @type {Map<number, Map<number, string>>} */
const m = new Map();
const getter = Maps.mapCoordinateGetter(m);
const setter = Maps.mapCoordinateSetter(m);
const printer = Maps.mapCoordinate2DPrint(m)(s => s);

input.forEach((line, y) => line.forEach((s, x) => setter([x,y], s)));

function shiftNorth() {
  for(let x = 0; x < input[0].length; x++) {
    let drop = 0;
    for(let y = 0; y < input.length; y++) {
      const s = getter([x,y]);
      if(s === '.') drop += 1;
      else if(s === '#') drop = 0;
      else if (drop > 0) {
        setter([x, y - drop], 'O');
        setter([x,y], '.');
      }
    }
  }
}
function shiftWest() {
  for(let y = 0; y < input.length; y++) {
    let drop = 0;
    for(let x = 0; x < input[0].length; x++) {
      const s = getter([x,y]);
      if(s === '.') drop += 1;
      else if(s === '#') drop = 0;
      else if (drop > 0) {
        setter([x - drop, y], 'O');
        setter([x,y], '.');
      }
    }
  }
}
function shiftSouth() {
  for(let x = 0; x < input[0].length; x++) {
    let drop = 0;
    for(let y = input.length - 1; y >= 0; y--) {
      const s = getter([x,y]);
      if(s === '.') drop += 1;
      else if(s === '#') drop = 0;
      else if (drop > 0) {
        setter([x, y + drop], 'O');
        setter([x,y], '.');
      }
    }
  }
}
function shiftEast() {
  for(let y = 0; y < input.length; y++) {
    let drop = 0;
    for(let x = input[0].length - 1; x >= 0; x--) {
      const s = getter([x,y]);
      if(s === '.') drop += 1;
      else if(s === '#') drop = 0;
      else if (drop > 0) {
        setter([x + drop, y], 'O');
        setter([x,y], '.');
      }
    }
  }
}

function load() {
  const rowOffset = input.length;
  let load = 0;
  m.forEach((m0, x) => m0.forEach((s, y) => {
    if(s === 'O') load += rowOffset - y
  }));
  return load;
}

function cycle() {
  shiftNorth();
  shiftWest();
  shiftSouth();
  shiftEast();
}

shiftNorth();

console.log(load());

shiftWest();
shiftSouth();
shiftEast();
const results = [load()];
for (let i = 0; i < 999; i++) {
  cycle();
  results.push(load());
}
const n1000 = results[results.length - 1];
const secondToLast = results.slice(0,999).lastIndexOf(n1000);
const cycleSize = 999 - secondToLast;

const remainingCycles = 1000000000 - 1000;
const remainder = remainingCycles % cycleSize;
console.log(results[secondToLast + remainder]);
