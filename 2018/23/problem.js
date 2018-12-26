const _ = require('lodash');
const input = require('./input');

const strongest = _.maxBy(input, 'r');

function manhattan(n1, n2) {
    return Math.abs(n1.x - n2.x) + Math.abs(n1.y - n2.y) + Math.abs(n1.z - n2.z);
}

const inRange = input.filter(nanobot => {
    return manhattan(strongest, nanobot) <= strongest.r;
});

console.log(inRange.length);

let max = 0;
let minDistance = 0;
let bestPoint;
let bestBot;


const origin = {
    x : 0,
    y : 0,
    z : 0
};
// _.chain(input)
//     .orderBy('r', 'asc')
//     .value()
//     .forEach(checkNanobot);
// input.forEach(checkNanobot);
// console.log(minDistance);
// console.log(bestPoint);
// console.log(bestBot);
//
// Result:
// New distance=109133552; count=922
// { x: 51438333, y: 12459905, z: 45235314 }
// Nanobot { x: 29698311, y: 14979861, z: 13235314, r: 56259978 }


const estimate = { x: 51438333, y: 12459905, z: 45235314 };
const keyBot = { x: 29698311, y: 14979861, z: 13235314, r: 56259978 };

for(let xOffset = -1000000; xOffset <= 1000000; xOffset++) {
    const x = estimate.x + xOffset;
    for(let yOffset = -1000000; yOffset <= 1000000; yOffset ++) {
        const y = yOffset + estimate.y;
        const zOffset = keyBot.r - Math.abs(keyBot.x - x) - Math.abs(keyBot.y - y);
        const z = zOffset + keyBot.z;
        check(x, y, z, keyBot);
    }
}

console.log(max);
console.log(minDistance);

function checkNanobot(nanobot) {
    console.log('New Nanobot');
    for(let xOffset = -nanobot.r; xOffset <= nanobot.r; xOffset += 1000000) {
        const x = xOffset + nanobot.x;
        const maxY = nanobot.r - Math.abs(xOffset);
        const minY = maxY * -1;
        for(let yOffset = minY; yOffset <= maxY; yOffset += 1000000) {
            const y = yOffset + nanobot.y;
            const zOffset = maxY - Math.abs(yOffset);
            const z = nanobot.z + zOffset;
            check(x, y, z, nanobot);
            if(zOffset !== 0) {
                check(x, y, nanobot.z - zOffset, nanobot);
            }
        }
    }
}

function check(x, y, z, nanobot) {
    const point = { x, y, z};
    const count = _.filter(input, nanobot => {
        const distance = manhattan(point, nanobot);
        return distance <= nanobot.r;
    }).length;
    if(count > max) {
        console.log(`New max ${count}`);
        max = count;
        const distance = manhattan(point, origin);
        console.log(`Distance: ${distance}`);
        console.log(point);
        console.log(nanobot);
        minDistance = distance;
        bestPoint = point;
        bestBot = nanobot;
    }
    else if (count === max) {
        const distance = manhattan(point, origin);
        if(distance < minDistance) {
            console.log(`New distance=${distance}; count=${count}`);
            console.log(point);
            console.log(nanobot);
            minDistance = distance;
            bestPoint = point;
            bestBot = nanobot;
        }
    }
}
