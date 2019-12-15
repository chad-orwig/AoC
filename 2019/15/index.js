const input = require('./input');
const intCode = require('../intCode');
const { Maps } = require('../../utils');
const keypress = require('keypress');
const colors = require('colors');
const { promisify } = require('util');
const sleep = promisify(setTimeout);
const bfs = require('../../bfs');
const flatMap = require('lodash/fp/flatMap');
const filter = require('lodash/fp/filter');
const flow = require('lodash/fp/flow');
keypress(process.stdin);

let nextDirection = 0;
const droidLocation = { x: 0, y: 0 };
let program = intCode(input, programInput());
const map = new Map();
const getter = Maps.mapCoordinateGetter(map);
const setter = Maps.mapCoordinateSetter(map);
const printer = Maps.mapCoordinate2DPrint(map)(characterPicker);
let oxygenSpaces

const locTypes = {
    unknown : undefined,
    empty : 1,
    wall : 2,
    oxygen : 3,
    droid : 4,
    oxygenAndDroid : 5,
    start : 6
};

const statusCodes = {
    hitWall : 0,
    moved : 1,
    found : 2
};

const directions = {
    up : 1,
    down : 2,
    left : 3,
    right : 4
}


setter([0,0], locTypes.droid);

function characterPicker(val) {
    switch(val) {
        case locTypes.wall:
            return ' '.bgWhite;
        case locTypes.droid:
            return 'D'.bgGreen;
        case locTypes.oxygen:
            return 'O'.bgCyan;
        case locTypes.oxygenAndDroid:
            return 'O'.bgCyan;
        case locTypes.empty:
            return ' '.bgYellow;
        case locTypes.start:
            return 'S'.bgMagenta;
        default: 
            return ' ';
    }
}

function* programInput() {
    while(true) {
        yield nextDirection;
    }
}

function takeStep({x,y}) {
    switch(nextDirection) {
        case directions.up:
            y--;
            break;
        case directions.down:
            y++;
            break;
        case directions.left:
            x--;
            break;
        case directions.right:
            x++;
            break;
    }
    return { x, y };
}

function addWall() {
    let { x, y } = takeStep(droidLocation);
    
    setter([x,y], locTypes.wall);
}

function moveDroid() {
    let {x,y} = takeStep(droidLocation);
    const newLoc = getter([x,y]) === locTypes.oxygen ? locTypes.oxygenAndDroid : locTypes.droid;
    const oldLoc = 
        droidLocation.x === 0 && droidLocation.y === 0 ? locTypes.start :
        getter([droidLocation.x, droidLocation.y]) === locTypes.oxygenAndDroid ? 
            locTypes.oxygen : locTypes.empty;
    setter([x,y], newLoc);
    setter([droidLocation.x, droidLocation.y], oldLoc);
    droidLocation.x = x;
    droidLocation.y = y;
}

function foundOxygen() {
    const {x,y} = droidLocation;
    setter([x,y], locTypes.oxygenAndDroid);
    oxygenSpaces = [{x,y}];
}

function readOutput(statusCode) {
    switch(statusCode) {
        case statusCodes.hitWall:
            addWall();
            break;
        case statusCodes.moved:
            moveDroid();
            break;
        case statusCodes.found:
            moveDroid();
            foundOxygen();
            break;
        default :
            throw `Unknown status code ${statusCode}`;

    }
}

function manualControl() {
    printer();
    process.stdin.on('keypress', function (ch, key) {
    
        if(key.name === 'x') {
            process.exit();
        }
        const direction = directions[key.name];
        nextDirection = direction || nextDirection;
    
        const output = program.next().value;
        readOutput(output);
        console.log('\033[2J');
        printer();
    });
}

function isEmpty(x, y) {
    return getter([x,y]) === undefined;
}

function nextToEmpty({x, y}) {
    if(isEmpty(x - 1, y)) return directions.left;
    if(isEmpty(x + 1, y)) return directions.right;
    if(isEmpty(x, y - 1)) return directions.up;
    if(isEmpty(x, y + 1)) return directions.down;
}

function isFullyExplored() {
    return droidLocation.x === 0 &&
        droidLocation.y === 0 &&
        !nextToEmpty(droidLocation);
}

function inverseDirection(direction) {
    switch(direction) {
        case directions.up: return directions.down;
        case directions.down: return directions.up;
        case directions.left: return directions.right;
        case directions.right: return directions.left;
    }
}

const drawing = true;

async function automaticControl() {
    let frameReady = sleep(50);
    const path = [];
    let backtracking;
    while(!isFullyExplored()) {
        nextDirection = nextToEmpty(droidLocation);
        if(!nextDirection) {
            backtracking = true;
            nextDirection = inverseDirection(path.pop());
        }
        else {
            backtracking = false;
        }
        const output = program.next().value;
        if(output !== statusCodes.hitWall && !backtracking) {
            path.push(nextDirection);
        }
        readOutput(output);
        if(drawing) {
            await frameReady;
            frameReady = sleep(100);
            console.log('\033[2J');
            printer();
        }
    }
}

function notWall({x, y}) {
    return getter([x,y]) !== locTypes.wall;
}

function notOxygen({x,y}) {
    return getter([x,y]) !== locTypes.oxygen;
}

function nextSteps(x,y) {
    return [
        {
            x : x - 1,
            y
        },
        {
            x : x + 1,
            y
        },
        {
            x,
            y : y -1
        },
        {
            x,
            y : y + 1
        }
    ];
}

function findFastestPath() {
    const finished = ({x,y}) => getter([x,y]) === locTypes.oxygen ? 0 : 1;
    const nextStates = ({x,y}) => {
        return nextSteps(x,y)
            .filter(notWall);
    }
    return bfs(droidLocation, nextStates, finished);
}

async function fillWithOxygen() {
    let frameReady = sleep(50);
    let minutes = -1;
    const nextSpaces = flow(
        flatMap(({x,y}) => nextSteps(x,y)),
        filter(notWall),
        filter(notOxygen)
    )
    while(oxygenSpaces.length) {
        oxygenSpaces = nextSpaces(oxygenSpaces);
        oxygenSpaces.forEach(({x,y}) => setter([x,y], locTypes.oxygen));
        minutes++;
        if(drawing) {
            await frameReady;
            frameReady = sleep(100);
            console.log('\033[2J');
            printer();
        }
    }

    return minutes;
}

automaticControl()
    .then(printer)
    .then(findFastestPath)
    .then(ans => console.log(ans))
    .then(fillWithOxygen)
    .then(ans => console.log(ans))
    .catch(console.error);