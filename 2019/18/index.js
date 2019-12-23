const input = require('./input');
const bfs = require('../../bfs');
const findIndex = require('lodash/fp/findIndex');
const filter = require('lodash/fp/filter');
const eq = require('lodash/fp/eq');
const test = `#################
#i.G..c...e..H.p#
########.########
#j.A..b...f..D.o#
########@########
#k.E..a...g..B.n#
########.########
#l.F..d...h..C.m#
#################`;

const rows = input.split('\n')
    .map(row => row.split(''));

const a = 'a'.charCodeAt(0);
const z = 'z'.charCodeAt(0);
const A = 'A'.charCodeAt(0);
const Z = 'Z'.charCodeAt(0);


function spaceAtLoc(x,y) {
    return rows[y] && rows[y][x];
}
function nextSteps(x,y) {
    return [
        {x, y : y + 1},
        {x, y : y - 1},
        {x : x + 1, y},
        {x : x - 1, y}
    ];
}
const isKey = (space) => {
    const code = space.charCodeAt(0);
    return code >= a && code <= z;
}

const filterToKeys = filter(isKey);
const numKeys = rows.map(filterToKeys).reduce((sum, curr) => sum + curr.length, 0);

const isDoor = (space) => {
    const code = space.charCodeAt(0);
    return code >= A && code <= Z;
}
const hasKey = (space, keySet) => {
    return findIndex(eq(space.toLowerCase()))(keySet) >= 0;
}
const canStand = ({space, keySet}) => {
    if(!space) return false;
    switch(space) {
        case '#': return false;
        case '.':
        case '@': return true;
        default:
            if(isDoor(space)) {
                return hasKey(space, keySet);
            }
            else {
                return true;
            }
    }
}
const determineNextStatesReStructured = (x,y,keySet) => {
    const steps = nextSteps(x,y)
        .map(state => {
            state.space = spaceAtLoc(state.x,state.y);
            if(isKey(state.space) && !hasKey(state.space, keySet)) {
                state.keySet = [...keySet, state.space].sort();
            } else {
                state.keySet = keySet;
            }
            return state;
        })
        .filter(canStand);
    return steps;
}
const determineNextStates = ({x,y,keySet}) => {
    return determineNextStatesReStructured(x,y,keySet);
}

const keysRemaining = ({keySet}) => {
    return numKeys - keySet.length;
}
let best = Number.MAX_VALUE;
const keepSearching = (limit) => (fewestKeysRemaining, myKeysRemaining) => {
    if(fewestKeysRemaining < best) {
        best = fewestKeysRemaining;
    }
    return myKeysRemaining - fewestKeysRemaining <= limit;
}

const findStart = findIndex(eq('@'));

const start = rows.reduce((found, row, y) => {
    if(found) return found;
    const x = findStart(row);
    if(x >= 0) return {x,y};
}, false);

start.keySet = [];
console.time('part 1');
const ans = bfs(start,determineNextStates, keysRemaining, keepSearching(7));

console.log(ans.steps);
console.timeEnd('part 1');
delete ans;

const part2 = {
    r1 : {x: start.x + 1, y: start.y + 1},
    r2 : {x: start.x + 1, y: start.y - 1},
    r3 : {x: start.x - 1, y: start.y + 1},
    r4 : {x: start.x - 1, y: start.y - 1},
    keySet : []
};

rows[start.y][start.x] = '#';
rows[start.y + 1][start.x] = '#';
rows[start.y - 1][start.x] = '#';
rows[start.y][start.x + 1] = '#';
rows[start.y][start.x - 1] = '#';

const robotReplacer = (r1, r2, r3, r4, oldKeySet) => {
    return (val) => ({x,y,keySet}) => {
        const robotReplaced = {r1,r2,r3,r4,keySet};
        robotReplaced[val] = {x,y};
        if(keySet === oldKeySet) {
            robotReplaced.robotMoving = val;
        }
        return robotReplaced;
    }
}


function stringify({r1,r2,r3,r4,keySet}) {
    return `${r1.x},${r1.y},${r2.x},${r2.y},${r3.x},${r3.y},${r4.x},${r4.y},${keySet.join(',')}`
}

const customWriteThroughFunction = (visited, state) => {
    const set = visited.set || new Set();
    const str = stringify(state);
    if(set.has(str)) return false;
    set.add(str);
    visited.set = set;
}

const determineNextStatesPart2 = ({r1,r2,r3,r4,keySet,robotMoving}) => {
    const replacer = robotReplacer(r1,r2,r3,r4,keySet);
    const r1Steps = !robotMoving || robotMoving === 'r1' ? determineNextStatesReStructured(r1.x, r1.y, keySet).map(replacer('r1')) : [] ;
    const r2Steps = !robotMoving || robotMoving === 'r2' ? determineNextStatesReStructured(r2.x, r2.y, keySet).map(replacer('r2')) : [] ;
    const r3Steps = !robotMoving || robotMoving === 'r3' ? determineNextStatesReStructured(r3.x, r3.y, keySet).map(replacer('r3')) : [] ;
    const r4Steps = !robotMoving || robotMoving === 'r4' ? determineNextStatesReStructured(r4.x, r4.y, keySet).map(replacer('r4')) : [] ;
    return r1Steps.concat(r2Steps, r3Steps, r4Steps);
}
best = Number.MAX_VALUE;
console.time('part 2');
const ans2 = bfs(part2, determineNextStatesPart2, keysRemaining, keepSearching(7));
console.timeEnd('part 2');
console.log(ans2.steps);