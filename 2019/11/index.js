const {Maps} = require('../../utils');
const intcode = require('../intCode');
const program = require('./input');
const flatMap = require('lodash/fp/flatMap');

const white = '█';
const black = ' ';

const directions = [0,1,2,3];
const [UP,RIGHT,DOWN,LEFT] = directions;

const map = new Map();
const setter = Maps.mapCoordinateSetter(map);
const getter = Maps.mapCoordinateGetter(map);
const counter = Maps.mapCoordinateSize(map);

let x = 0;
let y = 0;
setter(0,0,white);

function* inputGenerator() {
    while(true) {
        const color = getter(x, y) || black;
        yield color === black ? 0 : 1;
    }
}

function nextDirection(curDirection, turn) {
    return turn ? 
        (curDirection + 1) % directions.length :
        (curDirection - 1 + directions.length) % directions.length;
}

function moveDirection(direction) {
    switch(direction) {
        case UP:
            y--;
            break;
        case RIGHT:
            x++;
            break;
        case DOWN:
            y++;
            break;
        case LEFT:
            x--;
            break;
        default:
            throw `unknown direction ${direction}`;
    }
}

const robot = intcode(program, inputGenerator());

let done = false;
let direction = UP;
while(!done) {
    const {value:colorNum} = robot.next();
    const {done:isDone, value:turn} = robot.next();
    done = isDone;
    if(!done) {
        const color = colorNum ? white : black;
        setter(x,y,color);
        direction = nextDirection(direction, turn);
        moveDirection(direction);
    }
}

const xCoords = Array.from(map.keys());
const minX = Math.min(...xCoords);
const maxX = Math.max(...xCoords);
console.log(minX, maxX);
const xDiff = 0 - minX;

const yCoords = flatMap(rowMap => Array.from(rowMap.keys()))(Array.from(map.values()));

const minY = Math.min(...yCoords);
const maxY = Math.max(...yCoords);
console.log(minY, maxY);
const yDiff = 0 - minY;

const message = [];

for(let x = minX; x <= maxX; x++) {
    const col = x + xDiff;
    for(let y = minY; y <= maxY; y++) {
        row = y + yDiff;
        const rowArr = message[row] || [];
        message[row] = rowArr;
        rowArr[col] = getter(x, y) || black;
    }
}

console.log(message.map(row => row.join('')));

//Part 1 is now wrong because we seed the one white value...remove line 19 and uncomment for part 1
// console.log(counter());