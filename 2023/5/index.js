import {seeds, maps, seedRanges} from './input.js';

const locations = seeds.map(seed => maps.reduce((v, m) => m.map(v), seed));
console.log(Math.min(...locations));

const p2Locations = maps.reduce((ranges, m) => m.mapRange(ranges), seedRanges);

const p2 = Math.min(...p2Locations.map(({ start }) => start))
console.log(p2);
