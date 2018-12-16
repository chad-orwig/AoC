const ops = require('./operations');
const _ = require('lodash');
const inputa = require('./inputa');

function parseCommand(cmd) {
    return cmd.split(' ').map(Number);
}

function parseState(state) {
    return JSON.parse(state.slice(8));
}

let states = [];

_.forEach(inputa.split('\n'), (s, i) => {
    const index = Math.floor(i / 4);
    const type = i % 4;

    switch(type) {
        case 0:
            states[index] = { before: parseState(s)};
            break;

        case 1:
            states[index].cmd = parseCommand(s);
            break;

        case 2:
            states[index].after = parseState(s);
            break;
    }
});

function countPossibleOps(state) {
    const o = ops([]);
    const functions = Object.keys(o);
    state.possible = [];
    functions.forEach(func => {
        o.length = 0;
        o.push(...state.before);
        o[func](...state.cmd.slice(1));
        if(_.isEqual(o, state.after)) {
            state.possible.push(func);
        }

    });
}

states.forEach(countPossibleOps);
console.log(_.filter(states, s => s.possible.length >= 3).length);

let cmdMap = {};

while (Object.keys(cmdMap).length < 16) {
    const determined = _.chain(states)
        .filter(s => s.possible.length === 1)
        .groupBy(s => s.cmd[0])
        .value();

    states = _.filter(states, state => !determined[state.cmd[0]]);

    _.forEach(determined, (stateArray, cmd) => {
        const state = stateArray[0];
        const funcName = state.possible[0];
        cmdMap[cmd] = funcName;
        _.forEach(states, state => state.possible = _.without(state.possible, funcName));
    });

}

const commands = require('./inputb').split('\n').map(parseCommand);

const registers = ops([0,0,0,0]);

commands.forEach(cmd => {
    const funcName = cmdMap[cmd[0]];
    registers[funcName](...cmd.slice(1));
});

console.log([...registers]);