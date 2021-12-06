import { input, testInput } from "./input.js";
import utils from '../../utils.js';

const { Maps } = utils;
const regex = /(\d+),(\d+) -> (\d+),(\d+)/;
const parsed = input
    .map(str => regex.exec(str))
    .map(([input, x1, y1, x2, y2]) => (
        {
            input,
            x1: Number(x1),
            y1: Number(y1),
            x2: Number(x2),
            y2: Number(y2)
        }));

const map = new Map();
const getter = Maps.mapCoordinateGetter(map);
const setter = Maps.mapCoordinateSetter(map);
const printer = Maps.mapCoordinate2DPrint(map)(i => i);

const horizontal = parsed.filter(({y1, y2}) => y1 === y2);
const vertical = parsed.filter(({x1, x2}) => x1 === x2);

horizontal.forEach(({x1,x2,y2:y}) => {
    const start = Math.min(x1, x2);
    const end = Math.max(x1, x2);
    new Array(end - start + 1)
        .fill(start)
        .map((v, i) => v + i)
        .forEach(x => {
            const currentValue = getter([x,y]) ?? 0
            setter([x,y], currentValue + 1)
        });
});

vertical.forEach(({y1,y2,x2:x}) => {
    const start = Math.min(y1, y2);
    const end = Math.max(y1, y2);
    new Array(end - start + 1)
        .fill(start)
        .map((v, i) => v + i)
        .forEach(y => {
            const currentValue = getter([x,y]) ?? 0;
            setter([x,y], currentValue + 1)
        });
});

const pt1 = Maps.mapExploder(map)()
  .filter(num => num > 1)
  .length;

console.log(pt1);

const diagonal = parsed.filter(({x1, y1, x2, y2 }) => x1 !== x2 && y1 !== y2);

diagonal.forEach(({ x1, x2, y1, y2}) => {
    const xInc = x1 < x2;

    const yInc = y1 < y2;

    new Array(Math.abs(x1 - x2) + 1)
        .fill([x1, y1])
        .map(([x,y], i) => [xInc ? x + i : x - i, yInc ? y + i : y - i])
        .forEach(([x, y]) => {
            const currentValue = getter([x,y]) ?? 0;
            setter([x,y], currentValue + 1);
        });
});

const pt2 = Maps.mapExploder(map)()
.filter(num => num > 1)
.length;
console.log(pt2)