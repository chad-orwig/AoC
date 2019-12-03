const _ = require('lodash');
const nameMap = {};
function rebuildNameMap(programs) {
    _.forEach(programs, (val, index) => {
        nameMap[val] = index;
    });
}
function spin(programs, val) {
    const spinIndex = programs.length - val;
    const newPrograms =[ ...programs.slice(spinIndex), ...programs.slice(0, spinIndex)];
    rebuildNameMap(newPrograms);
    return newPrograms;
}
function exchange(programs, a, b) {
    const oldA = programs[a];
    const oldB = programs[b];
    programs[a] = oldB;
    programs[b] = oldA;
    nameMap[oldA] = b;
    nameMap[oldB] = a;
    return programs;
}

function partner(programs, aName, bName) {
    const aLoc = nameMap[aName];
    const bLoc = nameMap[bName];
    return exchange(programs, aLoc, bLoc);
}

let programs = ['a', 'b', 'c','d', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];
rebuildNameMap(programs);
const input = require('./input');

const commandMap = {
    's': spin,
    'x': exchange,
    'p': partner
};


// for(let i = 0; i < 1000; i++) {
//     for(let j = 0; j < 1000000; j++) {
//         for(let k = 0; k < input.length; k++) {
//             const line = input[k];
//             const commandFunc = commandMap[line.command];
//             programs = commandFunc(programs, ...line.params);
//         }
//     }
//     console.log(i);
// }
// console.log(programs.join(''));
/*




n
l
c
i
b
o
g
h
j
m
f
d
a
p
e
k
 */
//console.log(programs.join(''));

const newIndexs = [6, 13, 7, 2, 11, 8, 14, 3, 15, 5, 10, 1, 9, 12, 0, 4];

function doItAll(programs) {
    const newPrograms = [];
    for(let i = 0; i < 16; i++) {
        newPrograms[i] = programs[newIndexs[i]];
    }
    return newPrograms;
}
programs = ['a', 'b', 'c','d', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];
for(let i = 0; i < 1000; i++) {
    for(let j = 0; j < 1000000; j++) {
        programs = doItAll(programs);
        rebuildNameMap(programs);
        programs = partner(programs, 'n', 'g');
        programs = partner(programs, 'g', 'l');
        programs = partner(programs, 'h', 'c');
        programs = partner(programs, 'i', 'h');
        programs = partner(programs, 'g', 'b');
        programs = partner(programs, 'h', 'o');
        programs = partner(programs, 'g', 'h');
        programs = partner(programs, 'h', 'd');
        programs = partner(programs, 'p', 'j');
        programs = partner(programs, 'm', 'f');
        programs = partner(programs, 'k', 'f');
        programs = partner(programs, 'a', 'p');
        programs = partner(programs, 'k', 'p');
        programs = partner(programs, 'e', 'k');
    }
    console.log(i);
}

console.log(programs.join(''));