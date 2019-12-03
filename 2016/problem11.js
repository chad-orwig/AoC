"use strict";
const _ = require('lodash');
const md5 = require('md5');
const moment = require('moment');
const startTime = moment();

const startingState = {
    floors : {
        '1' : {
            generators : ['t', 'pl', 's'].sort(),
            microchips : ['t'],
            player : true
        },
        '2' : {
            generators: [],
            microchips: ['pl', 's'].sort(),
            player : false
        },
        '3' : {
            generators: ['pr', 'r'].sort(),
            microchips: ['pr', 'r'].sort(),
            player : false
        },
        '4' : {
            generators : [],
            microchips : [],
            player : false
        }
    },
    player : '1',
    steps  : 0
};

const partTwoStartingState = {
    floors : {
        '1' : {
            generators : ['e','d','t', 'pl', 's'].sort(),
            microchips : ['e','d','t'],
            player : true
        },
        '2' : {
            generators: [],
            microchips: ['pl', 's'].sort(),
            player : false
        },
        '3' : {
            generators: ['pr', 'r'].sort(),
            microchips: ['pr', 'r'].sort(),
            player : false
        },
        '4' : {
            generators : [],
            microchips : [],
            player : false
        }
    },
    player : '1',
    steps  : 0
};

const demoState = {
    floors : {
        '1' : {
            generators : [],
            microchips : ['h', 'l'].sort(),
            player : true
        },
        '2' : {
            generators: ['h'],
            microchips: [],
            player : false
        },
        '3' : {
            generators: ['l'],
            microchips: [],
            player : false
        },
        '4' : {
            generators : [],
            microchips : [],
            player : false
        }
    },
    player : '1',
    steps  : 0
};

const previousFloorStates = {};

const floorOrder = {
    '1' : {
        up : '2'
    },
    '2' : {
        up : '3',
        down : '1'
    },
    '3' : {
        up : '4',
        down : '2'
    },
    '4' : {
        down : '3'
    }
};

function allMicrochipsCovered(floor) {
    const uncoveredMicrochip = _.find(floor.microchips, (chip) => {
        const matchingGenerator = _.find(floor.generators, _.matches(chip));
        return !matchingGenerator;
    });

    return !uncoveredMicrochip;
}

function allGeneratorsCovered(floor) {
    const uncoveredGenerator = _.find(floor.generators, (generator) => {
        const matchingChip = _.find(floor.microchips, _.matches(generator));
        return !matchingChip;
    });
    return !uncoveredGenerator;
}

function isValidFloor(floor) {
    if(floor.generators.length === 0 || floor.microchips.length === 0) {
        return true;
    }
    else if(floor.generators.length >= floor.microchips.length) {
        return allMicrochipsCovered(floor);
    }
    else {
        return false;
    }
}

function isStateValid(state) {
    const floorState = md5(JSON.stringify(state.floors));
    if(previousFloorStates[floorState]) {
        return false;
    }
    else {
        previousFloorStates[floorState] = true;
    }

    const fitness =calcFitness(state);
    if(fitness > maxFitness) {
        maxFitness = fitness;
    }
    else if(fitness < (maxFitness - fitnessRequirement)) {
        fitnessKills++;
        return false;
    }

    const invalidFloor = _.find(state.floors, floor => !isValidFloor(floor));

    return !invalidFloor;
}

function moveGenerator(sourceFloor, destinationFloor, state, generator) {
    _.remove(state.floors[sourceFloor].generators, _.matches(generator));
    state.floors[destinationFloor].generators.push(generator);
    state.floors[destinationFloor].generators.sort();
}

function moveMicrochip(sourceFloor, destinationFloor, state, chip) {
    _.remove(state.floors[sourceFloor].microchips, _.matches(chip));
    state.floors[destinationFloor].microchips.push(chip);
    state.floors[destinationFloor].microchips.sort();
}

function emptyFloor(floor) {
    return floor.generators.length === 0 && floor.microchips.length === 0;
}

function gameOver(newState) {
    return (
        emptyFloor(newState.floors['1']) &&
        emptyFloor(newState.floors['2']) &&
        emptyFloor(newState.floors['3'])
    );
}

function buildNewState(sourceFloor, destinationFloor, currentState, payload) {
    const newState = _.cloneDeep(currentState);
    newState.player = destinationFloor;
    newState.floors[sourceFloor].player = false;
    newState.floors[destinationFloor].player = true;
    payload.forEach(item => {
        if(item.charAt(0) === 'g') {
            moveGenerator(sourceFloor, destinationFloor, newState, item.slice(1));
        }
        else if(item.charAt(0) === 'c') {
            moveMicrochip(sourceFloor, destinationFloor, newState, item.slice(1));
        }
        else {
            throw `Unknown payload item ${item}`;
        }
    });
    newState.steps ++;
    if(gameOver(newState)) {
        console.log(newState.steps);
        console.log(`we started ${startTime.fromNow()}`);
        process.exit();
    }

    return newState;
}

function buildNewStates(sourceFloor, destinationFloor, currentState, payloads) {
    return _.chain(payloads)
        .map(payload => {
            return buildNewState(sourceFloor, destinationFloor, currentState, payload);
        })
        .filter(isStateValid)
        .value();
}

function buildPossiblePayloads(sourceFloor) {
    const allItems = _.concat(
        _.map(sourceFloor.generators, generator => 'g' + generator),
        _.map(sourceFloor.microchips, chip => 'c' + chip)
    );

    const possiblePayloads = [];

    for(let i = 0; i < allItems.length; i++) {
        possiblePayloads.push([allItems[i]]);
        for(let j = i + 1; j < allItems.length; j++) {
            possiblePayloads.push([allItems[i], allItems[j]]);
        }
    }
    return possiblePayloads;
}

function findValidStates(state) {
    const sourceFloorNumber = state.player;
    const sourceFloor = state.floors[sourceFloorNumber];
    const possiblePayloads = buildPossiblePayloads(sourceFloor);
    const upFloorNumber = floorOrder[sourceFloorNumber].up;
    const downFloorNumber = floorOrder[sourceFloorNumber].down;

    const upOptions = upFloorNumber ? buildNewStates(sourceFloorNumber, upFloorNumber, state, possiblePayloads) : [];
    const downOptions = downFloorNumber ? buildNewStates(sourceFloorNumber, downFloorNumber, state, possiblePayloads) : [];
    return upOptions.concat(downOptions);
}

function calcFitness(state) {
    return (
        (4 * (state.floors['4'].generators.length + state.floors['4'].microchips.length)) +
        (3 * (state.floors['3'].generators.length + state.floors['3'].microchips.length)) +
        (2 * (state.floors['2'].generators.length + state.floors['2'].microchips.length)) +
        ((state.floors['1'].generators.length + state.floors['1'].microchips.length))
    )
}

let maxFitness = 0;
let fitnessKills = 0;
const fitnessRequirement = 4;
let states = [partTwoStartingState];

while(states.length) {
    const newStates = [];
    for(let i = 0; i < states.length; i++) {
        newStates.push(...findValidStates(states[i]));
        states[i] = null;
    }
    states = newStates;
    console.log(`live states ${states.length}`);
    //console.log(`total states: ${Object.keys(previousFloorStates).length}`);
    console.log(`max fitness=${maxFitness}`);
}
console.log('woops');