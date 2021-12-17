import { input } from "./input.js";

const target = {
    x1: input[0],
    x2: input[1],
    y1: input[2],
    y2: input[3],
};

console.log(target);

// x distance will be (start / 2) * start...because average distance will be start / 2
for(var xV=1; Math.pow(xV,2)/2 < target.x1; xV++);

console.log(xV);

function doYStep(pos, vel) {
    const newPos = pos + vel;
    const newVel = vel - 1;
    return { newPos, newVel };
}

function doXStep (pos, vel) {
    const newPos = pos + vel;
    const newVel = vel && vel - 1;
    return { newPos, newVel };
}

let yV = 0;
let highest = 0;
const yCandidate = 0;
const possibleYs =[];
for(let yVCandidate = -2000; yVCandidate < 2000; yVCandidate++) {
    let pos = 0;
    let vel = yVCandidate;
    let maxY = pos;
    while(pos > target.y2) {
        const { newPos, newVel } = doYStep(pos, vel);
        maxY = Math.max(maxY, newPos);
        pos = newPos;
        vel = newVel;
    }
    if(
        pos <= target.y2 &&
        pos >= target.y1
    ) {
        possibleYs.push(yVCandidate);
        if(maxY > highest) {
            yV = yVCandidate;
            highest = maxY;
        }
    }
}

console.log(highest);

const possibleXs = [];

for(let xCandidate = xV; xCandidate <= target.x2; xCandidate++) {
    let pos = 0;
    let vel = xCandidate;

    while(pos < target.x1) {
        const { newPos, newVel } = doXStep(pos, vel);
        pos = newPos;
        vel = newVel;
    }
    if(pos <= target.x2) {
        possibleXs.push(xCandidate);
    }
}

function conditionsWork(vXStart, vYStart) {
    let xPos = 0;
    let yPos = 0;
    let xVel = vXStart;
    let yVel = vYStart;

    while (
        !((
            xPos >= target.x1 &&
            xPos <= target.x2 &&
            yPos <= target.y2 &&
            yPos >= target.y1
        ) || xPos > target.x2 || yPos < target.y1)
    ) {
        const newX = doXStep(xPos, xVel);
        const newY = doYStep(yPos, yVel);
        
        xPos = newX.newPos;
        xVel = newX.newVel;

        yPos = newY.newPos;
        yVel = newY.newVel;
        
    }

    if(
        xPos >= target.x1 &&
        xPos <= target.x2 &&
        yPos <= target.y2 &&
        yPos >= target.y1
    ) return true;

    return false;

}

const workingCount = possibleXs
    .map(x => possibleYs.filter(y => conditionsWork(x, y)).length)
    .reduce((a,b) => a + b);

console.log(possibleXs.length);
console.log(possibleYs.length);
console.log(workingCount);