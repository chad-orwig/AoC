import { input } from './input.js';
import utils from '../../utils.js';
const { Maps } = utils;
const inputRegex = /(on|off) x=([\-\d]+)\.\.([\-\d]+),y=([\-\d]+)\.\.([\-\d]+),z=([\-\d]+)\.\.([\-\d]+)/;
const instructions = input.split('\n')
    .map(str => inputRegex.exec(str))
    .map(([_map, power, xStart, xFin, yStart, yFin, zStart, zFin]) => ({ power, xStart: Number(xStart), xFin: Number(xFin), yStart: Number(yStart), yFin: Number(yFin), zStart: Number(zStart), zFin: Number(zFin) }));

const pt1Instructions = instructions
    .filter(({xStart}) => xStart >= -50)
    .filter(({yStart}) => yStart >= -50)
    .filter(({zStart}) => zStart >= -50)
    .filter(({xFin}) => xFin <= 50)
    .filter(({yFin}) => yFin <= 50)
    .filter(({zFin}) => zFin <= 50);

function bruteForce(instructions) {
    const cubeMap = new Map();
    const setter = Maps.mapCoordinateSetter(cubeMap);

    instructions.forEach(({ power, xStart, xFin, yStart, yFin, zStart, zFin}) => {
        for(let x = xStart; x <= xFin; x++) {
            for(let y = yStart; y <= yFin; y++) {
                for (let z = zStart; z <= zFin; z++) {
                    setter([x,y,z], power);
                }
            }
        }
    });
    return Maps.mapExploder(cubeMap)()
        .filter(power => power === 'on')
        .length;
}
console.log(bruteForce(pt1Instructions));

function pairUp () {
    return this.map((v, i, arr) => [v, arr?.[i + 1]])
        .filter(([v1, v2]) => v1 && v2)
        .filter(([v1], i, arr) => arr?.[i + 1 ]?.v1 !== v1);
}

function dealWtihBorders(dominantSet) {
    return this.map((v, i, arr) => {
        const before = arr?.[i - 1];
        const after = arr?.[i + 1];
        let newStart = v[0];
        let newEnd = v[1];
        if(before) {
            if(!dominantSet.has(v[0]) && dominantSet.has(before[1])) newStart++;
        }
        if(after) {
            if(!dominantSet.has(v[1]) || dominantSet.has(after[0])) newEnd--;
        }

        return [newStart, newEnd];
    })
}

Array.prototype.pairUp = pairUp;
Array.prototype.dealWtihBorders = dealWtihBorders;

function pointInside(cube, { x, y, z}) {
    return (x >= cube.xStart) &&
        (x <= cube.xFin) &&
        (y >= cube.yStart) &&
        (y <= cube.yFin) &&
        (z >= cube.zStart) &&
        (z <= cube.zFin);
}
function corners({xStart, xFin, yStart, yFin, zStart, zFin}) {
    return [
        { x: xStart, y: yStart, z: zStart},
        { x: xStart, y: yFin, z: zStart},
        { x: xStart, y: yStart, z: zFin},
        { x: xStart, y: yFin, z: zFin},
        { x: xFin, y: yStart, z: zStart},
        { x: xFin, y: yFin, z: zStart},
        { x: xFin, y: yStart, z: zFin},
        { x: xFin, y: yFin, z: zFin},
    ]
}
function cubesInteract(c1, c2) {
    return c1.xFin >= c2.xStart &&
        c2.xFin >= c1.xStart &&
        c1.yFin >= c2.yStart &&
        c2.yFin >= c1.yStart &&
        c1.zFin >= c2.zStart &&
        c2.zFin >= c1.zStart;
}

function fullyInclosed(bigCube, smallCube) {
    return corners(smallCube).every(point => pointInside(bigCube, point))
}

function isValid({ xStart, xFin, yStart, yFin, zStart, zFin}) {
    return xStart <= xFin &&
        yStart <= yFin &&
        zStart <= zFin;
}

const pointFinder = (cubeCandidate) => (match, cube) => {
    if(match) return match;
    const points = corners(cubeCandidate).filter(p => pointInside(cube, p));
    points.cube = cube;
    return points;
};

function allSame(arr, property) {
    return arr.map(v => v[property]).filter(v => v).every(v => v===arr[0][property])
}

function mergeCubes(c1, c2) {
    const xs = [c1.xStart, c1.xFin, c2.xStart, c2.xFin]
        .sort((a,b) => a - b)
        .pairUp();
    const ys = [c1.yStart, c1.yFin, c2.yStart, c2.yFin]
        .sort((a,b) => a - b)
        .pairUp();
    const zs = [c1.zStart, c1.zFin, c2.zStart, c2.zFin]
        .sort((a,b) => a - b)
        .pairUp();

    const cubes = xs.flatMap(
        ([xStart, xFin]) => ys.flatMap(
            ([yStart, yFin]) => zs.flatMap(
                (([zStart, zFin]) => ({ xStart, xFin, yStart, yFin, zStart, zFin })))));
        

    const primaryCubes = cubes.filter(c => fullyInclosed(c2, c));

    const secondaryCubes = cubes.filter(c => !primaryCubes.includes(c) && fullyInclosed(c1, c));

    return [...primaryCubes.map(c => ({ ...c, power: c2.power })), ...secondaryCubes.map(c => ({...c, power: c1.power }))].reduce((arr, cubeCandidate) => {
        let match = arr.reduce(pointFinder(cubeCandidate), null);

        while(match?.length) {
            if(allSame(match, 'x')) {
                if(match[0].x === cubeCandidate.xStart) cubeCandidate.xStart++;
                else if(match[0].x === cubeCandidate.xFin) cubeCandidate.xFin--;
            }
            if(allSame(match, 'y')) {
                if(match[0].y === cubeCandidate.yStart) cubeCandidate.yStart++;
                else if(match[0].y === cubeCandidate.yFin) cubeCandidate.yFin--;
            }
            if(allSame(match, 'z')) {
                if(match[0].z === cubeCandidate.zStart) cubeCandidate.zStart++;
                else if(match[0].z === cubeCandidate.zFin) cubeCandidate.zFin--;
            }


            match = arr.reduce(pointFinder(cubeCandidate), null);
        }
        if(isValid(cubeCandidate)) {
            arr.push(cubeCandidate);
        }

        return arr;

    }, []);

}

function destructure(cube) {
    const {xStart, xFin, yStart, yFin, zStart, zFin} = cube;
    const center = { xStart: xStart + 1, xFin: xFin - 1, yStart: yStart + 1, yFin: yFin - 1, zStart: zStart + 1, zFin: zFin - 1};
    const top = { yStart: yFin, yFin, xStart, xFin, zStart, zFin};
    const bottom = { yStart, yFin: yStart, xStart, xFin, zStart, zFin};
    const front = { xStart, xFin, yStart: yStart + 1, yFin: yFin - 1, zStart, zFin: zStart};
    const back = { xStart, xFin, yStart: yStart + 1, yFin: yFin - 1, zStart: zFin, zFin};
    const left = {xStart, xFin: xStart, yStart: yStart + 1, yFin: yFin - 1, zStart: zStart + 1, zFin: zFin - 1};
    const right = {xStart: xFin, xFin, yStart: yStart + 1, yFin: yFin - 1, zStart: zStart + 1, zFin: zFin - 1}

    return [center, top, bottom, front, back, left, right].filter(isValid);
}

function addInstruction(cubeArray, instruction) {
    const dominatedRemoved = cubeArray.filter(c => !fullyInclosed(instruction, c));
    const interactions = dominatedRemoved.filter((cube) => cubesInteract(cube, instruction));
    const interactingCube = interactions[0];
    if(!interactingCube) return [...dominatedRemoved, instruction];

    const withoutInteractingCube = dominatedRemoved.filter(cube => cube !== interactingCube);
    const newCubes = mergeCubes(interactingCube, instruction)
        .map(c => ({ ...c, newArea: !fullyInclosed(interactingCube, c)}))

    const cubesNotBoundByInteractingCube = newCubes.filter(({newArea}) => newArea);
    if(!cubesNotBoundByInteractingCube.length) return [...withoutInteractingCube, ...newCubes];
    const cubesBoundByInteractingCube = newCubes.filter(({newArea}) => !newArea);
    const checkForMoreInteractions = cubesNotBoundByInteractingCube.reduce(addInstruction, withoutInteractingCube)
    return [
        ...checkForMoreInteractions,
        ...cubesBoundByInteractingCube,
    ]

}

function subtractFrom(mineuend, subtrahend) {
    const xs = [mineuend.xStart, mineuend.xFin, subtrahend.xStart, subtrahend.xFin]
        .sort((a,b) => a - b);
    const ys = [mineuend.yStart, mineuend.yFin, subtrahend.yStart, subtrahend.yFin]
        .sort((a,b) => a - b);
    const zs = [mineuend.zStart, mineuend.zFin, subtrahend.zStart, subtrahend.zFin]
        .sort((a,b) => a - b);

    
    const cubeToRemove = {
        xStart: xs[1],
        xFin: xs[2],
        yStart: ys[1],
        yFin: ys[2],
        zStart: zs[1],
        zFin: zs[2],
    };

    return [
        {
            xStart: mineuend.xStart,
            xFin : cubeToRemove.xStart - 1,
            yStart: mineuend.yStart,
            yFin : cubeToRemove.yStart - 1,
            zStart: mineuend.zStart,
            zFin : cubeToRemove.zStart - 1,
        },
        {
            xStart: cubeToRemove.xStart,
            xFin : cubeToRemove.xFin,
            yStart: mineuend.yStart,
            yFin : cubeToRemove.yStart - 1,
            zStart: mineuend.zStart,
            zFin : cubeToRemove.zStart - 1,
        },
        {
            xStart: cubeToRemove.xFin + 1,
            xFin : mineuend.xFin,
            yStart: mineuend.yStart,
            yFin : cubeToRemove.yStart - 1,
            zStart: mineuend.zStart,
            zFin : cubeToRemove.zStart - 1,
        },
        {
            xStart: mineuend.xStart,
            xFin : cubeToRemove.xStart - 1,
            yStart: cubeToRemove.yStart,
            yFin : cubeToRemove.yFin,
            zStart: mineuend.zStart,
            zFin : cubeToRemove.zStart - 1,
        },
        {
            xStart: cubeToRemove.xStart,
            xFin : cubeToRemove.xFin,
            yStart: cubeToRemove.yStart,
            yFin : cubeToRemove.yFin,
            zStart: mineuend.zStart,
            zFin : cubeToRemove.zStart - 1,
        },
        {
            xStart: cubeToRemove.xFin + 1,
            xFin : mineuend.xFin,
            yStart: cubeToRemove.yStart,
            yFin : cubeToRemove.yFin,
            zStart: mineuend.zStart,
            zFin : cubeToRemove.zStart - 1,
        },
        {
            xStart: mineuend.xStart,
            xFin : cubeToRemove.xStart - 1,
            yStart: cubeToRemove.yFin + 1,
            yFin : mineuend.yFin,
            zStart: mineuend.zStart,
            zFin : cubeToRemove.zStart - 1,
        },
        {
            xStart: cubeToRemove.xStart,
            xFin : cubeToRemove.xFin,
            yStart: cubeToRemove.yFin + 1,
            yFin : mineuend.yFin,
            zStart: mineuend.zStart,
            zFin : cubeToRemove.zStart - 1,
        },
        {
            xStart: cubeToRemove.xFin + 1,
            xFin : mineuend.xFin,
            yStart: cubeToRemove.yFin + 1,
            yFin : mineuend.yFin,
            zStart: mineuend.zStart,
            zFin : cubeToRemove.zStart - 1,
        },


        {
            xStart: mineuend.xStart,
            xFin : cubeToRemove.xStart - 1,
            yStart: mineuend.yStart,
            yFin : cubeToRemove.yStart - 1,
            zStart: cubeToRemove.zStart,
            zFin : cubeToRemove.zFin,
        },
        {
            xStart: cubeToRemove.xStart,
            xFin : cubeToRemove.xFin,
            yStart: mineuend.yStart,
            yFin : cubeToRemove.yStart - 1,
            zStart: cubeToRemove.zStart,
            zFin : cubeToRemove.zFin,
        },
        {
            xStart: cubeToRemove.xFin + 1,
            xFin : mineuend.xFin,
            yStart: mineuend.yStart,
            yFin : cubeToRemove.yStart - 1,
            zStart: cubeToRemove.zStart,
            zFin : cubeToRemove.zFin,
        },
        {
            xStart: mineuend.xStart,
            xFin : cubeToRemove.xStart - 1,
            yStart: cubeToRemove.yStart,
            yFin : cubeToRemove.yFin,
            zStart: cubeToRemove.zStart,
            zFin : cubeToRemove.zFin,
        },
        {
            xStart: cubeToRemove.xFin + 1,
            xFin : mineuend.xFin,
            yStart: cubeToRemove.yStart,
            yFin : cubeToRemove.yFin,
            zStart: cubeToRemove.zStart,
            zFin : cubeToRemove.zFin,
        },
        {
            xStart: mineuend.xStart,
            xFin : cubeToRemove.xStart - 1,
            yStart: cubeToRemove.yFin + 1,
            yFin : mineuend.yFin,
            zStart: cubeToRemove.zStart,
            zFin : cubeToRemove.zFin,
        },
        {
            xStart: cubeToRemove.xStart,
            xFin : cubeToRemove.xFin,
            yStart: cubeToRemove.yFin + 1,
            yFin : mineuend.yFin,
            zStart: cubeToRemove.zStart,
            zFin : cubeToRemove.zFin,
        },
        {
            xStart: cubeToRemove.xFin + 1,
            xFin : mineuend.xFin,
            yStart: cubeToRemove.yFin + 1,
            yFin : mineuend.yFin,
            zStart: cubeToRemove.zStart,
            zFin : cubeToRemove.zFin,
        },


        {
            xStart: mineuend.xStart,
            xFin : cubeToRemove.xStart - 1,
            yStart: mineuend.yStart,
            yFin : cubeToRemove.yStart - 1,
            zStart: cubeToRemove.zFin + 1,
            zFin : mineuend.zFin,
        },
        {
            xStart: cubeToRemove.xStart,
            xFin : cubeToRemove.xFin,
            yStart: mineuend.yStart,
            yFin : cubeToRemove.yStart - 1,
            zStart: cubeToRemove.zFin + 1,
            zFin : mineuend.zFin,
        },
        {
            xStart: cubeToRemove.xFin + 1,
            xFin : mineuend.xFin,
            yStart: mineuend.yStart,
            yFin : cubeToRemove.yStart - 1,
            zStart: cubeToRemove.zFin + 1,
            zFin : mineuend.zFin,
        },
        {
            xStart: mineuend.xStart,
            xFin : cubeToRemove.xStart - 1,
            yStart: cubeToRemove.yStart,
            yFin : cubeToRemove.yFin,
            zStart: cubeToRemove.zFin + 1,
            zFin : mineuend.zFin,
        },
        {
            xStart: cubeToRemove.xStart,
            xFin : cubeToRemove.xFin,
            yStart: cubeToRemove.yStart,
            yFin : cubeToRemove.yFin,
            zStart: cubeToRemove.zFin + 1,
            zFin : mineuend.zFin,
        },
        {
            xStart: cubeToRemove.xFin + 1,
            xFin : mineuend.xFin,
            yStart: cubeToRemove.yStart,
            yFin : cubeToRemove.yFin,
            zStart: cubeToRemove.zFin + 1,
            zFin : mineuend.zFin,
        },
        {
            xStart: mineuend.xStart,
            xFin : cubeToRemove.xStart - 1,
            yStart: cubeToRemove.yFin + 1,
            yFin : mineuend.yFin,
            zStart: cubeToRemove.zFin + 1,
            zFin : mineuend.zFin,
        },
        {
            xStart: cubeToRemove.xStart,
            xFin : cubeToRemove.xFin,
            yStart: cubeToRemove.yFin + 1,
            yFin : mineuend.yFin,
            zStart: cubeToRemove.zFin + 1,
            zFin : mineuend.zFin,
        },
        {
            xStart: cubeToRemove.xFin + 1,
            xFin : mineuend.xFin,
            yStart: cubeToRemove.yFin + 1,
            yFin : mineuend.yFin,
            zStart: cubeToRemove.zFin + 1,
            zFin : mineuend.zFin,
        },
    ]
        .filter(isValid)
        .map(c => ({...c, power: mineuend.power}));

}

function count({ xStart, xFin, yStart, yFin, zStart, zFin}) {
    const width = BigInt(xFin - xStart + 1);
    const height =  BigInt(yFin - yStart + 1);
    const depth =  BigInt(zFin - zStart + 1);

    return width * height * depth;

}

let onCount = BigInt(0);
let currentlyOnSlices = []

instructions.forEach(instruction => {
    if(instruction.power === 'off') {
        currentlyOnSlices = currentlyOnSlices.flatMap(c => {
            if(cubesInteract(instruction, c)) return subtractFrom(c, instruction);
            return [c];
        })
    }
    else {
        const remainder = [instruction];
        while(remainder.length) {
            const check = remainder.pop();
            const interaction = currentlyOnSlices.find(c => cubesInteract(c, check));
            if(interaction) {
                const difference = subtractFrom(check, interaction);
                difference.forEach(c => remainder.push(c));
            }
            else {
                currentlyOnSlices.push(check);
            }
        }
    }
});

console.log(currentlyOnSlices.map(count).reduce((a,b) => a + b));
// console.log(subtractFrom(instructions[0], instructions[1]));
