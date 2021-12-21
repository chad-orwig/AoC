import { input } from "./input.js"
import utils from '../../utils.js';

const Maps = utils.Maps;

function Beacon(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function Scanner(id, beacons) {
    this.id = id;
    this.beacons = beacons;
}
function readBeacon(str) {
    const [x,y,z] = str.split(',').map(Number);
    return new Beacon(x,y,z);
}

function readScanner(str) {
    const [ header, ...beaconStrings ] = str.split('\n');
    const id = Number(/\d+/.exec(header)[0]);
    const beacons = beaconStrings
        .map(readBeacon);
    
    return new Scanner(id, beacons);
}

const scanners = input.split('\n\n')
    .map(readScanner);

const rotations = [
    ({x,y,z}) => [x,y,z],
    ({x,y,z}) => [z,x,y], 
    ({x,y,z}) => [y,z,x],
    ({x,y,z}) => [-x,-y,z],
    ({x,y,z}) => [z,-x,-y],
    ({x,y,z}) => [-y,z,-x],
    ({x,y,z}) => [-x,y,-z],
    ({x,y,z}) => [-z,-x,y],
    ({x,y,z}) => [y,-z,-x],
    ({x,y,z}) => [x,-y,-z],
    ({x,y,z}) => [-z,x,-y],
    ({x,y,z}) => [-y,-z,x],
    ({x,y,z}) => [-x,z,y],
    ({x,y,z}) => [z,y,-x],
    ({x,y,z}) => [x,z,-y],
    ({x,y,z}) => [-y,x,z],
    ({x,y,z}) => [z,-y,x],
    ({x,y,z}) => [x,-z,y],
    ({x,y,z}) => [y,x,-z],
    ({x,y,z}) => [-z,y,x],
    ({x,y,z}) => [z,-y,-x],
    ({x,y,z}) => [-x,-z,-y],
    ({x,y,z}) => [-y,-x,-z],
    ({x,y,z}) => [-z,-y,-x],
];

const s0 = scanners[0];
const s1 = scanners[1];

function createTransforms(beacons) {
    return beacons
    .map(b => rotations
      .map(fn => fn(b)));
}

function matchTransforms(beacons, transforms) {
    const matchCounts = beacons
        .flatMap(b => transforms.flatMap((b2Rotations) => b2Rotations.map(([x,y,z], i) =>[x -b.x, y - b.y, z - b.z, i])))
        .map(arr => JSON.stringify(arr))
        .reduce((o, cmd) => {
            o[cmd] = (o[cmd] ?? 0) + 1
        return o 
    },{});
    const[transformString, count] = Object.entries(matchCounts)
        .reduce((e1, e2) => e1[1] > e2[1] ? e1 : e2);

    const [translateX, translateY, translateZ, rotationFnIndex ] = JSON.parse(transformString);
    const transform = {
        translateX,
        translateY,
        translateZ,
        rotation : rotations[rotationFnIndex]
    };
    return { transform, count };
}

function doTransform(beacon, transform) {
    const [x,y,z] = transform.rotation(beacon);
    return {
        x: x - transform.translateX,
        y: y - transform.translateY,
        z: z - transform.translateZ,
    };
}

function mergeBeacons(b1, b2) {
    const stringSet = new Set([...b1, ...b2]
        .map((o) => JSON.stringify(o))
    );
    return Array.from(stringSet)
        .map(str => JSON.parse(str));
}
const scannerTransforms = [];
const reducer = (s1, s2) => {
    if(s1.idSet && s1.idSet.has(s2.id)) return s1;
    const transforms = createTransforms(s2.beacons);
    const bestMatch = matchTransforms(s1.beacons, transforms);
    if(bestMatch.count < 12) return s1;

    const idSet = s1.idSet ?? new Set([s1.id]);
    if(s2.idSet) {
        s2.idSet.forEach(id => {
            idSet.add(id);
            const transformList = scannerTransforms[id] ?? [];
            transformList.push(bestMatch.transform);
            scannerTransforms[id] = transformList;
        });
    }
    else {
        idSet.add(s2.id);
        const transformList = scannerTransforms[s2.id] ?? [];
        transformList.push(bestMatch.transform);
        scannerTransforms[s2.id] = transformList;

    }
    const transformed = s2.beacons.map(b => doTransform(b, bestMatch.transform));
    const beacons = mergeBeacons(s1.beacons, transformed);
    return {
        idSet,
        beacons
    }
};

function getSmaller(remainingScanners=scanners) {
    let results = [];
    
    console.log('get smaller');
    while(remainingScanners.length) {
        const result = remainingScanners.reduce(reducer);
        if(!result.idSet) result.idSet = new Set([result.id]);
        remainingScanners = remainingScanners.filter(s => {
            if(!s.idSet) return !result.idSet.has(s.id)
            return Array.from(s.idSet)
                .filter(id => result.idSet.has(id))
                .length === 0;
        });
        results.push(result);
    }
    results.sort((a,b) => b.beacons.length - a.beacons.length);
    return results;
}
console.time('pt1');

let results = getSmaller(scanners);

while(results.length > 1) {
    results = getSmaller(results);
}

const fullSet = results[0];
console.log(fullSet.beacons.length);
console.timeEnd('pt1');
console.time('pt2');
const scannerLocations = scanners
    .map(() => ({x: 0, y: 0, z: 0}))
    .map((loc, i) => {
        if(!scannerTransforms[i]) return loc;
        return scannerTransforms[i].reduce((loc, transform) => doTransform(loc, transform), loc)
    });



const furthestDistance = scannerLocations
    .flatMap((loc1, index) => scannerLocations
        .filter((_s, i) => i > index)
        .map(loc2 => [loc1, loc2])
    )
    .map(([l1, l2]) => Math.abs(l1.x - l2.x) + Math.abs(l1.y - l2.y) + Math.abs(l1.z - l2.z))
    .reduce((a,b) => Math.max(a,b));

console.log(furthestDistance);
console.timeEnd('pt2');