"use strict";
const input = require('./input');
const _ = require('lodash');
const nameMap ={};
input.forEach(prog => {
    nameMap[prog.name] = prog;
});

function mapSupports(prog) {
    if(prog.supports) {
        prog.supports = _.filter(prog.supports);
        prog.supportObjects = prog.supports.map(name => nameMap[name]);
        prog.supportObjects.forEach(supportObject => supportObject.parent = prog);
    }
}

input.forEach(prog => {
   mapSupports(prog);
});

let head = input[0];

while(head.parent) {
    head = head.parent;
}

function computeTotalWeight(program) {
    if(!program) {
        return;
    }
    if(!program.supports) {
        program.totalWeight = program.weight;
        return computeTotalWeight(program.parent);
    }
    const unweighdSupport = _.find(program.supportObjects, program => !program.totalWeight);
    if(unweighdSupport) {
        return computeTotalWeight(unweighdSupport);
    }
    program.totalWeight = _.sumBy(program.supportObjects, 'totalWeight') + program.weight;
    return computeTotalWeight(program.parent);

}

computeTotalWeight(head);

console.log(head.totalWeight);

input.forEach(i => delete i.parent);

console.log(JSON.stringify(head, null, 2));