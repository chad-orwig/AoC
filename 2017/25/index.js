const _ = require('lodash');

let state = 'A';
const vals = {};
let cursor = 0;
function aState() {
    const current = vals[cursor];
    if(current) {
        vals[cursor] = 0;
        cursor-= 1;
        state = 'C';
    }
    else {
        vals[cursor] = 1;
        cursor++;
        state = 'B';
    }
}

function bState() {
    const current = vals[cursor];
    if(current) {
        cursor -= 1;
        state = 'D'
    }
    else {
        vals[cursor] = 1;
        cursor -= 1;
        state = 'A';
    }
}

function cState() {
    const current = vals[cursor];
    if(current) {
        vals[cursor] = 0;
        cursor ++;
    }
    else {
        vals[cursor] = 1;
        cursor++;
        state = 'D';
    }
}

function dState() {
    const current = vals[cursor];
    if(current) {
        vals[cursor] = 0;
        cursor++;
        state = 'E';
    }
    else {
        cursor -= 1;
        state = 'B';
    }
}

function eState() {
    const current = vals[cursor];
    if(current) {
        cursor -= 1;
        state = 'F';
    }
    else {
        vals[cursor] = 1;
        cursor++;
        state = 'C';
    }
}

function fState() {
    const current = vals[cursor];
    if(current) {
        cursor++;
        state = 'A';
    }
    else {
        vals[cursor] = 1;
        cursor -= 1;
        state = 'E';
    }
}

const stateMap = {
    A : aState,
    B : bState,
    C : cState,
    D : dState,
    E : eState,
    F : fState
};

for(let i = 0; i < 12656374; i++) {
    const func = stateMap[state];
    func();
}

const arr = _.filter(vals);

console.log(arr.length);