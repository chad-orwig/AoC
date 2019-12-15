const input = require('./input');
const intCode = require('../intCode');
const { Maps } = require('../../utils');
const keypress = require('keypress');
const colors = require('colors');
const { promisify } = require('util');
const sleep = promisify(setTimeout);
keypress(process.stdin);

let nextDirection = 0;
const droidLocation = { x: 0, y: 0 };
let program = intCode(input, programInput());
const map = new Map();
const getter = Maps.mapCoordinateGetter(map);
const setter = Maps.mapCoordinateSetter(map);
const printer = Maps.mapCoordinate2DPrint(map)(characterPicker);

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
            return '█';
        case locTypes.droid:
            return 'D'.bgGreen;
        case locTypes.oxygen:
            return 'O'.bgRed;
        case locTypes.oxygenAndDroid:
            return '█'.rainbow;
        case locTypes.empty:
            return ' '.bgYellow;
        case locTypes.start:
            return 'S'.bgYellow;
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

printer();

function manualControl() {
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
        await frameReady;
        frameReady = sleep(50);
        console.log('\033[2J');
        printer();
    }
}

automaticControl()
    .catch(console.error);