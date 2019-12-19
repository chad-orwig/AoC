const input = require('./input');
const intCode = require('../intCode');
const {Maps} = require('../../utils');

let points = 0;

let x;
let y;

function* scanner() {
    while(true) {
        yield x;
        yield y;
    }
}

let sum = 0;
for(let i = 0; i < 50; i++) {
    x = i;
    for(let j = 0; j < 50; j++) {
        y = j;
        const program = intCode(input, scanner());
        const output = program.next().value;
        if(output) {
            sum++;
        }
    }
}

console.log(sum);

function findCorners(distance) {
    const corners = [];
    for(let x = 0; x <= distance; x++) {
        const y = distance - x
        corners.push({x, y});
    }
    return corners;
}

const resultMap = new Map();
const getter = Maps.mapCoordinateGetter(resultMap);
const setter = Maps.mapCoordinateSetter(resultMap);
const spaceTypes = {
    pulling : '#',
    notPulling : '.'
};

function checkForFit({x:startX,y:startY}) {
    for(let x = startX; x < 100 + startX; x++){
        for(let y = startY; y < 100 + startY; y++) {
            const inMap = getter([x,y]);
            if(inMap) {
                if(inMap === spaceTypes.notPulling) return false;
                else continue;
            }
            const result = intCode(input, [x,y]).next().value;
            const type = result ? spaceTypes.pulling : spaceTypes.notPulling;
            setter([x,y], type);
            if(type === spaceTypes.notPulling) return false;
        }
    }

    return true;
}

let spaceFound = [];
let distance = 0;
while(!spaceFound.length) {
    console.log(`checking distance ${distance}`);
    spaceFound = findCorners(distance)
        .filter(checkForFit);
    distance++;
}

spaceFound.forEach(({x,y}) => console.log(`${(x * 10000 + y)}`));