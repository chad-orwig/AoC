const input = require('./input');
const {Maps} = require('../../utils');
const flatMap = require('lodash/fp/flatMap');
const flow = require('lodash/fp/flow');
const map = require('lodash/fp/map');

function Moon([pX, pY, pZ]) {
    this.pX = pX;
    this.pY = pY;
    this.pZ = pZ;

    this.vX = 0;
    this.vY = 0;
    this.vZ = 0;
}

function calcChange(aVal, bVal) {
    if(aVal === bVal) {
        return 0;
    }
    return aVal < bVal ? +1 : -1;
}

function calcGravity(aMoon, bMoon) {
    const xChange = calcChange(aMoon.pX, bMoon.pX);
    const yChange = calcChange(aMoon.pY, bMoon.pY);
    const zChange = calcChange(aMoon.pZ, bMoon.pZ);

    aMoon.vX += xChange;
    bMoon.vX -= xChange;

    aMoon.vY += yChange;
    bMoon.vY -= yChange;

    aMoon.vZ += zChange;
    bMoon.vZ -= zChange;
}

function updatePosition(moon) {
    moon.pX += moon.vX;
    moon.pY += moon.vY;
    moon.pZ += moon.vZ;
}

function energy(moon) {
    return (Math.abs(moon.pX) + Math.abs(moon.pY) + Math.abs(moon.pZ)) * (Math.abs(moon.vX) + Math.abs(moon.vY) + Math.abs(moon.vZ));
}

function timeStep(moons) {
    moons.forEach((moon,index) => {
        moons.slice(index + 1)
            .forEach(otherMoon => calcGravity(moon, otherMoon));
    });

    moons.forEach(updatePosition);
}

let moons = input.map(m => new Moon(m));

for(let i = 0; i < 1000; i++) {
    timeStep(moons);
}

console.log(moons.map(energy).reduce((a,b) => a+b, 0));

moons = input.map(m => new Moon(m));

const moonMap = new Map();
const getter = Maps.mapCoordinateGetter(moonMap);
const setter = Maps.mapCoordinateSetter(moonMap);
const getArgs = flow(
    flatMap(({pX, pY, pZ, vX, vY, vZ}) => [pZ,vZ]),
    map(num => num.toString()),
    (s) => s.join(',')
);

const set = new Set();


function beenThereDoneThat(moons) {
    const args = getArgs(moons);
    return set.has(args);
}


function setMoons(moons) {
    const args = getArgs(moons);
    set.add(args);
    // setter([moon, moon.pX, moon.pY, moon.pZ, moon.vX, moon.vY, moon.vZ], true);
}

let numMillions = 0;
let steps = 0;

let match = false;

while(true) {
    if(!beenThereDoneThat(moons) === match) {
        match = !match;
        console.log(`${numMillions} millions + ${steps} steps -- ${match}`);
    }
    setMoons(moons);
    timeStep(moons);
    steps++;
    if(steps === 1000000) {
        steps = 0;
        numMillions++;
        console.log(`${numMillions} million`);
    }
}

console.log(`${numMillions} millions + ${steps} steps`);

while(beenThereDoneThat(moons)) {
    if(beenThereDoneThat(moons)) {
        console.log(`${numMillions} millions + ${steps} steps`);
    }
    setMoons(moons);
    timeStep(moons);
    steps++;
    if(steps === 1000000) {
        steps = 0;
        numMillions++;
        console.log(`${numMillions} million`);
    }
}

console.log(`${numMillions} millions + ${steps} steps`);