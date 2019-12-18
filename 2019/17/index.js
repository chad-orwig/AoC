const input = require('./input');
const intCode = require('../intCode');
const {Maps} = require('../../utils');

const program = intCode(input);
const screen = new Map();
const getter = Maps.mapCoordinateGetter(screen);
const setter = Maps.mapCoordinateSetter(screen);

let x = 0;
let y = 0;
for(let output of program) {
    let character = String.fromCharCode(output);
    if(character === '\n'){
        x = 0;
        y++;
    } else {
        setter([x,y], character);
        x++;
    }
}

const intersections = [];

for(let[x, yMap] of screen) {
    for(let[y, character] of yMap) {
        if(
            character === '#' &&
            getter([x,y - 1]) === '#' &&
            getter([x,y + 1]) === '#' &&
            getter([x - 1,y]) === '#' &&
            getter([x + 1,y]) === '#'
        ){
            intersections.push({x,y});
        }
    }
}

const sum = intersections.reduce((current, {x,y}) => current + (x * y), 0);

console.log(sum);