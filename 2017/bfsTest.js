"use strict";
const _ = require('lodash');
const bfs = require('../bfs');
const moment = require('moment');
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
    player : '1'
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

function completionGuess(state) {
    const floor1Items = state.floors['1'].generators.length + state.floors['1'].microchips.length;
    const floor2Items = state.floors['2'].generators.length + state.floors['2'].microchips.length;
    const floor3Items = state.floors['3'].generators.length + state.floors['3'].microchips.length;

    return ((floor1Items * 3) + (floor2Items * 2) + floor3Items);
}

let myClosest;
function keep(closest, me) {
    if(closest !== myClosest) {
        myClosest = closest;
        console.log(`getting closer ${myClosest}`);
    }
    return me - closest <= 4;
}

const startTime = moment();
const finalState = bfs(partTwoStartingState, findValidStates, completionGuess, keep);
console.log(`we started ${startTime.fromNow()}`);
console.log(finalState.steps);