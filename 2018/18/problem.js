const input = require('./input');
const _ = require('lodash');
const Map = require('../Map');

const acreTypes = {
    open       : '.',
    trees      : '|',
    lumberyard : '#'
};

function readInput(input) {
    const map = new Map();

    _.forEach(input, (row, y) => {
        _.forEach(row, (acre, x) => {
            map.set(x,y, acre);
        });
    });

    return map;
}

function minute(map) {
    const nextMinute = new Map();

    _.forEach(map, (acre, key) => {
        const [x, y] = key.split(',').map(Number);
        const adjacent = groupAdjacent(map, x, y);
        switch(acre) {
            case acreTypes.open:
                if(adjacent[acreTypes.trees] >= 3){
                    nextMinute.set(x, y, acreTypes.trees);
                }
                else {
                    nextMinute.set(x,y, acreTypes.open);
                }
                break;

            case acreTypes.trees :
                if(adjacent[acreTypes.lumberyard] >= 3){
                    nextMinute.set(x, y, acreTypes.lumberyard);
                }
                else {
                    nextMinute.set(x,y, acreTypes.trees);
                }
                break;

            case acreTypes.lumberyard :
                if(adjacent[acreTypes.lumberyard] && adjacent[acreTypes.trees]) {
                    nextMinute.set(x, y, acreTypes.lumberyard);
                }
                else {
                    nextMinute.set(x, y, acreTypes.open);
                }
                break;
        }
    });

    return nextMinute;
}

function groupAdjacent(map, x, y) {
    const adjacent = [
        map.get(x - 1, y), map.get(x - 1, y - 1), map.get(x - 1, y + 1),
        map.get(x + 1, y), map.get(x + 1, y - 1), map.get(x + 1, y + 1),
        map.get(x, y - 1), map.get(x, y + 1)
    ];

    return _.countBy(adjacent);
}

let map = readInput(input);
let prevVal = 0;

for( let i = 0; i < 1000000; i++) {
    console.log(`i=${i}`);
    for(let j = 0; j < 1000; j++) {
        map = minute(map);
        const groups = _.countBy(Object.values(map));
        const val = groups[acreTypes.trees] * groups[acreTypes.lumberyard]
        console.log(`val=${val}; diff=${val - prevVal}; i=${i*1000 + j}`);
        prevVal = val;
    }
};

const groups = _.countBy(Object.values(map));

console.log(JSON.stringify(groups, null, 2));

console.log(groups[acreTypes.trees] * groups[acreTypes.lumberyard]);