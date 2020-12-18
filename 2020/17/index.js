import input from './input.js';
import {BaseN} from '../../combinatorics.mjs';

const active = '#';
const inactive = '.';
const neighborOffsets = [ ...new BaseN([1, -1, 0], 3)]
    .filter(([z,y,x]) => z !== 0 || y !== 0 || x !== 0);

const neighbors = (z,y,x) => neighborOffsets
    .map(([zo, yo, xo]) => [z + zo, y + yo, x + xo]);

const mapKey = (z,x,y) => [z,x,y].join(',');
const toMapKey = ( arr ) => arr.join(',');
const fromMapKey = (str) => str.split(',')
    .map(Number);

const checkNeighbors = (map) => (z,y,x) => neighbors(z,y,x)
    .map(toMapKey)
    .map(key => map.get(key))
    .reduce((acc,val) => {
        switch(val) {
            case active:
                acc[active]++;
                break;
            default:
                acc[inactive]++;
                break;
        }
        return acc;

    },{ [active]: 0, [inactive]: 0});

const fillInNeighbors = (map, planeNum, rowNum, colNum) => neighbors(planeNum, rowNum, colNum)
    .map(toMapKey)
    .forEach(key => !map.has(key) && map.set(key, inactive));


const setCube = (map, planeNum, rowNum, colNum, value) => {
    map.set(mapKey(planeNum, rowNum, colNum), value);
    if(value === active) {
        fillInNeighbors(map, planeNum, rowNum, colNum);
    }
    return map;
}

const tick = (map) => {
    const changes = [];
    const neighborChecker = checkNeighbors(map);

    map.forEach((value, key) => {
        const [z,y,x] = fromMapKey(key);
        const neighborStatus = neighborChecker(z,y,x);
        switch(value) {
            case active:
                if(neighborStatus[active] < 2 || neighborStatus[active] > 3) changes.push({z,y,x,value: inactive});
                break;

            case inactive:
                if(neighborStatus[active] === 3) changes.push({z,y,x,value: active});
                break;

            default: throw new Error(`Unknown value ${value} with key ${key}`);
        }
    });
    changes.forEach(({z, y, x, value}) => setCube(map, z, y, x, value));
    return map;
}

const numActive = (map) => {
    let sum = 0;
    map.forEach((value) => value === active && sum++);
    return sum;
}

const loadColumn = (planeNum, rowNum) => (map, column, colNum) => setCube(map, planeNum, rowNum, colNum, column);

const loadRow = (planeNum) => (map, row, rowNum) => row.reduce(loadColumn(planeNum, rowNum), map);

const map = input.reduce(loadRow(0), new Map());

for(let i = 0; i < 6; i++) {
    tick(map);
    console.log(numActive(map));
}

const neighborOffsets2 = [ ...new BaseN([1, -1, 0], 4)]
    .filter((arr) => !arr.every(v => v === 0));

const neighbors2 = (w,z,y,x) => neighborOffsets2
    .map(([wo, zo, yo, xo]) => [w + wo, z + zo, y + yo, x + xo]);

const mapKey2 = (w,z,x,y) => [w,z,x,y].join(',');

const checkNeighbors2 = (map) => (w, z,y,x) => neighbors2(w,z,y,x)
    .map(toMapKey)
    .map(key => map.get(key))
    .reduce((acc,val) => {
        switch(val) {
            case active:
                acc[active]++;
                break;
            default:
                acc[inactive]++;
                break;
        }
        return acc;

    },{ [active]: 0, [inactive]: 0});

const fillInNeighbors2 = (map, w, z, y, x) => neighbors2(w, z, y, x)
    .map(toMapKey)
    .forEach(key => !map.has(key) && map.set(key, inactive));


const setCube2 = (map, w, z, y, x, value) => {
    map.set(mapKey2(w, z, y, x), value);
    if(value === active) {
        fillInNeighbors2(map, w, z, y, x);
    }
    return map;
}

const loadColumn2 = (w, z, y) => (map, val, x) => setCube2(map, w, z, y, x, val);

const loadRow2 = (w, z) => (map, row, y) => row.reduce(loadColumn2(w, z, y), map);

const tick2 = (map) => {
    const changes = [];
    const neighborChecker = checkNeighbors2(map);

    map.forEach((value, key) => {
        const [w,z,y,x] = fromMapKey(key);
        const neighborStatus = neighborChecker(w,z,y,x);
        switch(value) {
            case active:
                if(neighborStatus[active] < 2 || neighborStatus[active] > 3) changes.push({w,z,y,x,value: inactive});
                break;

            case inactive:
                if(neighborStatus[active] === 3) changes.push({w,z,y,x,value: active});
                break;

            default: throw new Error(`Unknown value ${value} with key ${key}`);
        }
    });
    changes.forEach(({w,z, y, x, value}) => setCube2(map, w, z, y, x, value));
    return map;
}

const map2 = input.reduce(loadRow2(0,0), new Map());

console.time();
console.log('pt2');
for(let i = 0; i < 6; i++) {
    tick2(map2);
    console.log(numActive(map2));
}
console.timeEnd();