import { input } from './input.js';
import bfs from '../../bfs/index.js';

const costs = {
    'A': 1,
    'B': 10,
    'C': 100,
    'D': 1000,
};

const l2 = {name: 'l2'};
const l1 = {name: 'l1'};
const a2 = {name: 'a2'};
const a1 = {name: 'a1'};
const b2 = {name: 'b2'};
const b1 = {name: 'b1'};
const c2 = {name: 'c2'};
const c1 = {name: 'c1'};
const d2 = {name: 'd2'};
const d1 = {name: 'd1'};
const r2 = {name: 'r2'};
const r1 = {name: 'r1'};
const h1 = {name: 'h1'};
const h2 = {name: 'h2'};
const h3 = {nmae: 'h3'}

h1.paths = [
    { dest: a2, dist: 3 },
    { dest: a1, dist: 2 },
    { dest: b2, dist: 3 },
    { dest: b1, dist: 2 },
    { dest: c2, dist: 5 },
    { dest: c1, dist: 4 },
    { dest: d2, dist: 7 },
    { dest: d1, dist: 6 },
];

h2.paths = [
    { dest: a2, dist: 5 },
    { dest: a1, dist: 4 },
    { dest: b2, dist: 3 },
    { dest: b1, dist: 2 },
    { dest: c2, dist: 3 },
    { dest: c1, dist: 2 },
    { dest: d2, dist: 5 },
    { dest: d1, dist: 4 },
];

h3.paths = [
    { dest: d2, dist: 3 },
    { dest: d1, dist: 2 },
    { dest: c2, dist: 3 },
    { dest: c1, dist: 2 },
    { dest: b2, dist: 5 },
    { dest: b1, dist: 4 },
    { dest: a2, dist: 7 },
    { dest: a1, dist: 6 },
];

l2.paths = [
    { dest: a2, dist: 4 },
    { dest: a1, dist: 3 },
    { dest: b2, dist: 6 },
    { dest: b1, dist: 5 },
    { dest: c2, dist: 8 },
    { dest: c1, dist: 7 },
    { dest: d2, dist: 10 },
    { dest: d1, dist: 9 },
];

l1.paths = [
    { dest: a2, dist: 3 },
    { dest: a1, dist: 2 },
    { dest: b2, dist: 5 },
    { dest: b1, dist: 4 },
    { dest: c2, dist: 7 },
    { dest: c1, dist: 6 },
    { dest: d2, dist: 9 },
    { dest: d1, dist: 8 },
];

r2.paths = [
    { dest: d2, dist: 4 },
    { dest: d1, dist: 3 },
    { dest: c2, dist: 6 },
    { dest: c1, dist: 5 },
    { dest: b2, dist: 8 },
    { dest: b1, dist: 7 },
    { dest: a2, dist: 10 },
    { dest: a1, dist: 9 },
];

r1.paths = [
    { dest: d2, dist: 3 },
    { dest: d1, dist: 2 },
    { dest: c2, dist: 5 },
    { dest: c1, dist: 4 },
    { dest: b2, dist: 7 },
    { dest: b1, dist: 6 },
    { dest: a2, dist: 9 },
    { dest: a1, dist: 8 },
];

a2.paths = [
    { dest: b2, dist: 6 },
    { dest: b1, dist: 5 },
    { dest: c2, dist: 8 },
    { dest: c1, dist: 7 },
    { dest: d2, dist: 10 },
    { dest: d1, dist: 9 },
]
a1.paths = [
    { dest: b2, dist: 5 },
    { dest: b1, dist: 4 },
    { dest: c2, dist: 7 },
    { dest: c1, dist: 6 },
    { dest: d2, dist: 9 },
    { dest: d1, dist: 8 },
]

b2.paths = [
    { dest: c2, dist: 6 },
    { dest: c1, dist: 5 },
    { dest: d2, dist: 8 },
    { dest: d1, dist: 7 },
]
b1.paths = [
    { dest: c2, dist: 5 },
    { dest: c1, dist: 4 },
    { dest: d2, dist: 7 },
    { dest: d1, dist: 6 },
]

c2.paths = [
    { dest: d2, dist: 6 },
    { dest: d1, dist: 5 },
]
c1.paths = [
    { dest: d2, dist: 5 },
    { dest: d1, dist: 4 },
]
d2.paths = [];
d1.paths = [];

function isBlocked (state, ant) {
    if(ant.loc === a2) return isOccuped(a1, state);
    if(ant.loc === b2) return isOccuped(b1, state);
    if(ant.loc === c2) return isOccuped(c1, state);
    if(ant.loc === d2) return isOccuped(d1, state);
    if(ant.loc === l2) return isOccuped(l1, state);
    if(ant.loc === r2) return isOccuped(r1, state);
    return false;
}

function isHome(state, ant) {
    switch(ant.type) {
        case 'A':
            return ant.loc === a2 || (ant.loc === a1 && state.ants.find(a => a.loc === a2)?.type === 'A');
        case 'B':
            return ant.loc === b2 || (ant.loc === b1 && state.ants.find(a => a.loc === b2)?.type === 'B');
        case 'C':
            return ant.loc === c2 || (ant.loc === c1 && state.ants.find(a => a.loc === c2)?.type === 'C');
        case 'D':
            return ant.loc === d2 || (ant.loc === d1 && state.ants.find(a => a.loc === d2)?.type === 'D');
        default: throw new Error(ant);
    }
}

function findHomes(ant) {
    let t2, t1;
    switch(ant.type) {
        case 'A':
            t2 = a2;
            t1 = a1;
            break;
        case 'B':
            t2 = b2;
            t1 = b1;
            break;
        case 'C':
            t2 = c2;
            t1 = c1;
            break;
        case 'D':
            t2 = d2;
            t1 = d1;
            break;
    }
    return { t1, t2 };
}
const leftOfH1 = [l1,l2,a1,a2];
const leftOfH2 = [...leftOfH1, b1 , b2, h1];
const leftOfH3 = [...leftOfH2, c1, c2, h2 ];
function blockedByHs(l1, l2, state) {
    if(
        l1 !== h1 &&
        l2 !== h1 &&
        isOccuped(h1, state) &&
        [l1,l2].filter(l => leftOfH1.includes(l)).length === 1
    ) return true;

    if(
        l1 !== h2 &&
        l2 !== h2 &&
        isOccuped(h2, state) &&
        [l1,l2].filter(l => leftOfH2.includes(l)).length === 1
    ) return true;

    if(
        l1 !== h3 &&
        l2 !== h3 &&
        isOccuped(h3, state) &&
        [l1,l2].filter(l => leftOfH3.includes(l)).length === 1
    ) return true;
    
    return false;
}

function canGoHome(state, ant) {
    const {t1, t2} = findHomes(ant);

    const t1Occupant = isOccuped(t1, state);
    const t2Occupant = isOccuped(t2, state)

    return !t1Occupant && 
    (!t2Occupant || t2Occupant.type === ant.type) &&
    !blockedByHs(t1, ant.loc, state);
}

function isInHallway({loc}) {
    return loc === l2 ||
        loc === l1 ||
        loc === r1 ||
        loc === r2 ||
        loc === h1 ||
        loc === h2 ||
        loc === h3;
}

function isOccuped(loc, state) {
    return state.ants.find(a => a.loc === loc);
}

function makeMove(state, ant, dest) {
    const newAnt = { ...ant, loc: dest };
    const distance = ant.loc.paths.find(p => p.dest === dest)?.dist || dest.paths.find(p => p.dest === ant.loc)?.dist;

    if(!distance){
        console.log(ant);
        console.log(dest);
        throw new Error();
    }

    const cost = distance * costs[ant.type];
    return {
        ants : state.ants.map(a => a === ant ? newAnt : { ...a}),
        energy: state.energy + cost,
        prev: state
    };
}

function findNextStates(state) {
    const antsThatCanMove = state.ants
        .filter(a => !isHome(state,a))
        .filter(a => !isBlocked(state, a))
        .filter(a => (!isInHallway(a)) || (isInHallway(a) && canGoHome(state, a)));

    const movesToMake = antsThatCanMove.flatMap(a => {
        if(canGoHome(state, a)) {
            const { t1, t2 } = findHomes(a);
            if(!state.ants.find(a => a.loc === t2)) return [[a, t2]];
            return [[a, t1]];
        }
        else {
            const hallwayOptions = [];
            if(!isOccuped(l1, state) && !blockedByHs(l1, a.loc, state)) {
                hallwayOptions.push(l1);
                if(!isOccuped(l2, state)) hallwayOptions.push(l2);
            }
            if(!isOccuped(r1, state) && !blockedByHs(r1, a.loc, state)) {
                hallwayOptions.push(r1);
                if(!isOccuped(r2, state)) hallwayOptions.push(r2);
            }
            if(!isOccuped(h1, state) && !blockedByHs(h1, a.loc, state))
                hallwayOptions.push(h1);
            if(!isOccuped(h2, state) && !blockedByHs(h2, a.loc, state))
                hallwayOptions.push(h2);
            if(!isOccuped(h3, state) && !blockedByHs(h3, a.loc, state))
                hallwayOptions.push(h3);
            return hallwayOptions.map(loc => [a, loc]);
        }
    });
    
    const nextStates = movesToMake.map(([ant, dest]) => makeMove(state, ant, dest));

    return nextStates;

}

const heuristic = (state) => {
    return state.ants.length - state.ants.filter(a => isHome(state, a)).length
}

const startingState = {
    ants: [
        { type: 'A', loc: a1},
        { type: 'B', loc: a2},
        { type: 'D', loc: b1},
        { type: 'C', loc: b2},
        { type: 'B', loc: c1},
        { type: 'A', loc: c2},
        { type: 'D', loc: d1},
        { type: 'C', loc: d2},
    ],
    energy: 0,
}

const testStartingState = {
    ants: [
        { type: 'B', loc: a1},
        { type: 'A', loc: a2},
        { type: 'C', loc: b1},
        { type: 'D', loc: b2},
        { type: 'B', loc: c1},
        { type: 'C', loc: c2},
        { type: 'D', loc: d1},
        { type: 'A', loc: d2},
    ],
    energy: 0
}


function stateToString(state) {
    const checker = (loc) => isOccuped(loc,state)?.type ?? '.';
    return `#############
#${checker(l2)}${checker(l1)}.${checker(h1)}.${checker(h2)}.${checker(h3)}.${checker(r1)}${checker(r2)}#
###${checker(a1)}#${checker(b1)}#${checker(c1)}#${checker(d1)}###
  #${checker(a2)}#${checker(b2)}#${checker(c2)}#${checker(d2)}#
  #########`
}

const bestToThisSpot = new Map();

let bestSeen = Infinity
function keepFunction(_h1, _h2, state) {
    if(_h2 < bestSeen) {
        console.log('closer', _h2);
        bestSeen = _h2;
    }
    const key = JSON.stringify(state.ants);
    const energyAtState = bestToThisSpot.get(key) ?? Infinity;
    if(state.energy >= energyAtState ) {
        return false;
    }
    bestToThisSpot.set(key, state.energy);
    return true;
}

const ans = bfs(startingState, findNextStates, heuristic, keepFunction, state => state, state => state.energy);

const path = [];
let next = ans.state;
while(next) {
    path.push(next);
    next = next.prev;
}
path.reverse();
path.map(s => stateToString(s))
.forEach(s => console.log(s));
console.log(ans.state);