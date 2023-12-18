import { input } from './input.js';
import utils from '../../utils.js';
const { Maps } = utils;


const directions = {
  up: '^',
  left: '<',
  right: '>',
  down: 'v',
}

const tiles = {
  empty: '.',
  hSplit: '-',
  vSplit: '|',
  upMirror: '/',
  dnMirror: '\\',
};

/**
 * 
 * @typedef {'^'|'v'|'>'|'<'} Direction
 * @param {number} x 
 * @param {number} y 
 * @param {Direction} d 
 * @returns {[number,number,Direction]}
 */
function travel(x,y,d) {
  switch (d) {
    case directions.up: return [x, y - 1, d];
    case directions.down: return [x, y + 1, d];
    case directions.left: return [x - 1, y, d];
    case directions.right: return [x + 1, y, d];
  }
}

/**
 * @typedef {'|'|'-'|'.'|'/'|'\\'} Tile
 * @param {number} x 
 * @param {number} y 
 * @param {Direction} d 
 * @param {Tile} t 
 */
function calcNextBeams(x,y,d,t) {
  if(t === tiles.empty) return [travel(x,y,d)];
  if(t === tiles.vSplit) {
    if(d === directions.up || d === directions.down) return [travel(x,y,d)];
    else return [
      travel(x,y,directions.up),
      travel(x,y,directions.down),
    ];
  }
  if(t === tiles.hSplit) {
    if(d === directions.left || d === directions.right) return [travel(x,y,d)];
    else return [
      travel(x,y,directions.left),
      travel(x,y,directions.right),
    ];
  }
  if(t === tiles.dnMirror) {
    switch(d) {
      case directions.up: return [travel(x,y,directions.left)];
      case directions.down: return [travel(x,y,directions.right)];
      case directions.left: return [travel(x,y,directions.up)];
      case directions.right: return [travel(x,y,directions.down)];
    }
  }
  if(t === tiles.upMirror) {
    switch(d) {
      case directions.down: return [travel(x,y,directions.left)];
      case directions.up: return [travel(x,y,directions.right)];
      case directions.right: return [travel(x,y,directions.up)];
      case directions.left: return [travel(x,y,directions.down)];
    }
  }
}

/**
 * 
 * @param {string[][]} input
 * @param {[number, number, Direction]} start
 */
function energizeCount(input, start) {

  /** 
   * @type {Map<number,Map<number, Direction[]>>} 
   */
  const beamsByLocation = new Map();

  const getBeamsByLocation = (() => {
    const getter = Maps.mapCoordinateGetter(beamsByLocation);
    /** @type {(c: [number,number]) => Direction[]} */
    const f = ([x,y]) => getter([x,y]) ?? [];
    return f;
  })();

  const setter = (() => {
    const s = Maps.mapCoordinateSetter(beamsByLocation);
    /** @type {(c: [number, number], d: Direction) => boolean} */
    const f =  (([x,y], d) => {
      const arr = getBeamsByLocation([x,y]);
      if (arr.includes(d)) return false;
      arr.push(d);
      s([x,y], arr);
      return true;
    });
    return f;
  })();

  /** @type {[number, number, Direction][]} */
  const heads = [start];
  while (heads.length) {
    const [x,y,d] = heads.pop();
    const tile = input[y]?.[x];
    if (!tile) continue;
    const newBeam = setter([x,y], d);
    if(!newBeam) continue;
    const beams = calcNextBeams(x,y,d,tile);
    heads.push(...beams);
  }
  
  const counter = Maps.mapCoordinateCountBy(beamsByLocation)((arr) => arr?.length ? 1 : 0);
  return counter();
}



console.log(energizeCount(input, [0,0, directions.right]));

// const validator = new Map();
// const vSet = Maps.mapCoordinateSetter(validator);
// input.forEach((row, y) => row.forEach((tile, x) => {
//   if(tile !== tiles.empty) vSet([x,y], tile);
//   else {
//     const beams = getBeamsByLocation(([x,y]));
//     if(beams.length > 1) vSet([x,y], beams.length.toString());
//     else if(beams.length === 1) vSet([x,y], beams[0]);
//     else vSet([x,y], tile);
//   }
// }));

// Maps.mapCoordinate2DPrint(validator)(c => c)();
const verts = input[0].flatMap((_,x) => [
  [x,0,directions.down],
  [x,input.length - 1, directions.up]
]);
const hors = input.flatMap((_, y) => [
  [0, y, directions.right],
  [input[0].length - 1, y, directions.left],
]);

const p2 = [...verts, ...hors]
  .map(n => energizeCount(input, n))
  .reduce((a,b) => a > b ? a : b);

console.log(p2);