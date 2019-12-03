const offset = 1358;
const _ = require('lodash');
function bitsEven(check) {
    const binaryString = check.toString(2);
    const count = _.sumBy(binaryString, letter => {
        return letter === '1' ? 1 : 0
    });

    return !(count % 2);
}

function isOpen(x, y) {
    if(x < 0 || y < 0) {
        return false;
    }

    const check = (x * x) + (3 * x) + (2 * x * y) + y + (y * y) + offset;
    if(!bitsEven(check)) {
        return false;
    }

    if(visitedLocations[`${x},${y}`]) {
        return false;
    }
    else {
        visitedLocations[`${x},${y}`] = true;
    }

    return true;
}

const visitedLocations = {
    '1,1':true
};

function addStepIfOpen(state, xOffset, yOffset, nextSteps) {
    const destX = state.x + xOffset;
    const destY = state.y + yOffset;
    if(destX === 31 && destY === 39) {
        console.log(state.steps + 1);
        process.exit();
    }
    if(isOpen(destX, destY)) {
        nextSteps.push({
            x: destX,
            y: destY,
            steps: state.steps + 1
        });
    }
}

function nextSteps(state) {
    const nextSteps = [];
    addStepIfOpen(state, 1, 0, nextSteps);
    addStepIfOpen(state, -1, 0, nextSteps);
    addStepIfOpen(state, 0, 1, nextSteps);
    addStepIfOpen(state, 0, -1, nextSteps);
    return nextSteps;
}

let activeStates = [
    {
        x : 1,
        y : 1,
        steps : 0
    }
];

let steps = 0;
while(steps < 50) {
    activeStates = _.flatMap(activeStates, nextSteps);
    steps++;
}

console.log(Object.keys(visitedLocations).length);