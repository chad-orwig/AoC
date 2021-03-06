const input = require('./input');
const intCode = require('../intCode');
const {Maps} = require('../../utils');
const colors = require('colors');
const {promisify} = require('util');
const sleep = promisify(setTimeout);

const tiles = {
    empty : 0,
    wall : 1,
    block : 2,
    h_paddle : 3,
    ball : 4
};

const tileLookup = Object.keys(tiles).reduce((arr, tileId) => {
        arr[tiles[tileId]] = tileId;
        return arr;
    }, []);

const screen = new Map();
const getter = Maps.mapCoordinateGetter(screen);
const setter = Maps.mapCoordinateSetter(screen);
const size = Maps.mapCoordinateSize(screen);
const countBlocks = Maps.mapCoordinateCountBy(screen)(tile => tile === tiles.block);

const part1 = intCode(input);

let x,y,score, ballX, paddleX;

const drawScreen = Maps.mapCoordinate2DPrint(screen)(characterPicker);

async function runProgram(program) {
    let frameAvailable = sleep(0);
    for(let output of program) {
        if(x === undefined) {
            x = output;
        }
        else if(y === undefined) {
            y = output;
        }
        else {
            if(x === -1 && y === 0) {
                score = output;
            }
            else {
                setter([x,y], output);
                if(output === tiles.ball) {
                    ballX = x;
                    await frameAvailable;
                    console.log('\033[2J');
                    drawScreen();
                    frameAvailable = sleep(75);
                }
                else if(output === tiles.h_paddle) {
                    paddleX = x;
                }
            }
            x = undefined;
            y = undefined;
        }
    }
}

runProgram(part1);

console.log(countBlocks());



function characterPicker(val) {
    switch(val) {
        case tiles.h_paddle: return ' '.bgYellow;
        case tiles.wall: return ' '.bgWhite;
        case tiles.block : return ' '.bgRed;
        case tiles.ball : return '●'.green;
        case tiles.empty : return ' ';
    }
}

function* directionInput() {
    while(true) {
        if(paddleX === ballX) {
            yield 0;
        }
        else if(paddleX > ballX) {
            yield -1;
        }
        else {
            yield 1;
        }
    }
    
}
x = undefined;
y = undefined;
ballX = undefined;
paddleX = undefined;
screen.clear();
const part2 = intCode([2, ...input.slice(1)], directionInput());

runProgram(part2);
console.log(score);

