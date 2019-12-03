const input = require('./input');
const _ = require('lodash');

const groups = [];

function mergeGroups (...groups) {
    return Object.assign({}, ...groups);
}

function groupContains(group, programs) {
    for(let i = 0; i < programs.length; i++) {
        if(group[programs[i]]) {
            return true;
        }
    }

    return false;
}

function addNewGroup(relatedPrograms) {
    const group = {};
    updateGroup(group, relatedPrograms);
    groups.push(group);
}

function updateGroup(group, relatedPrograms) {
    relatedPrograms.forEach(program => {
        group[program] = true;
    });
}

function consolidateGroups(relatedGroups, relatedPrograms) {
    _.pull(groups, ...relatedGroups);
    const group = mergeGroups(...relatedGroups);
    updateGroup(group, relatedPrograms);
    groups.push(group);
}

input.forEach(({programId, connections}) => {
    const relatedPrograms = [programId, ...connections];
    const relatedGroups = _.filter(groups, g => groupContains(g, relatedPrograms));
    switch (relatedGroups.length) {
        case 0:
            addNewGroup(relatedPrograms);
            break;
        case 1:
            updateGroup(relatedGroups[0], relatedPrograms);
            break;

        default:
            consolidateGroups(relatedGroups, relatedPrograms);
            break;
    }
});
debugger;
const groupWithZero = _.filter(groups, g => groupContains(g, ['0']));
if(groupWithZero.length !== 1) {
    throw `length = ${groupWithZero.length}`;
}

console.log(Object.keys(groupWithZero[0]).length);
console.log(groups.length);