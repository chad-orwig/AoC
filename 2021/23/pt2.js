import bfs from '../../bfs/index.js';

const l2 = 'l2';
const l1 = 'l1';
const r2 = 'r2';
const r1 = 'r1';
const h1 = 'h1';
const h2 = 'h2';
const h3 = 'h3';

const a = 'a';
const b = 'b';
const c = 'c';
const d = 'd';

const distances = {
    l2 : {
        a: 2,
        b: 4,
        c: 6,
        d: 8,
    },
    l1: {
        a: 1,
        b: 3,
        c: 5,
        d: 7,
    },
    r2 : {
        d: 2,
        c: 4,
        b: 6,
        a: 8,
    },
    r1: {
        d: 1,
        c: 3,
        b: 5,
        a: 7,
    },
    h1: {
        a: 1,
        b: 1,
        c: 3,
        d: 5,
    },
    h2: {
        a: 3,
        b: 1,
        c: 1,
        d: 3,
    },
    h3: {
        a: 5,
        b: 3,
        c: 1,
        d: 1,
    },
    a : {
        b: 2,
        c: 4,
        d: 6
    },
    b: {
        c: 2,
        d: 4,
    },
    c: { d: 2 },
    d: {}
};

Object.entries(distances)
    .flatMap(([source, map]) => Object.entries(map).map(([dest, dist]) => ({ source, dest, dist})))
    .forEach(({source, dest, dist}) => distances[dest][source] = dist);

function getNext(queue) {
    return queue?.[queue.length - 1];
}

function queueReady(queue, type) {
    return queue.every(a => a.type === type);
}

function canGoHome(state, ant) {
    const homeQueue = state.queues[ant.type.toLowerCase()];
    

    return queueReady(homeQueue, ant.type) && !blockedByHs(ant.type.toLowerCase(), ant.loc, state);
}

function isOccuped(loc, state) {
    return state.hallwayAnts.find(a => a.loc === loc);
}
const leftOfH1 = [l1,l2,a];
const leftOfH2 = [...leftOfH1, b, h1];
const leftOfH3 = [...leftOfH2, c, h2 ];
function blockedByHs(loc1, loc2, state) {
    if(
        loc1 !== h1 &&
        loc2 !== h1 &&
        isOccuped(h1, state) &&
        [loc1,loc2].filter(l => leftOfH1.includes(l)).length === 1
    ) return true;

    if(
        loc1 !== h2 &&
        loc2 !== h2 &&
        isOccuped(h2, state) &&
        [loc1,loc2].filter(l => leftOfH2.includes(l)).length === 1
    ) return true;

    if(
        loc1 !== h3 &&
        loc2 !== h3 &&
        isOccuped(h3, state) &&
        [loc1,loc2].filter(l => leftOfH3.includes(l)).length === 1
    ) return true;

    if(
        (loc1 === l2 || loc2 === l2) &&
        isOccuped(l1, state)
    ) return true;

    if(
        (loc1 === r2 || loc2 === r2) &&
        isOccuped(r1, state)
    ) return true;
    
    return false;
}
function calcDistance(source, dest, state) {
    const base = distances[source][dest];
    const extraSource = source.length === 1 ? 5 - state.queues[source].length : 0
    const extraDest = dest.length === 1 ? 4 - state.queues[dest].length : 0
    
    return base + extraSource + extraDest;
}
function calcEnergy(source, dest, type, state) {
    const distance = calcDistance(source, dest, state);
    switch(type) {
        case 'A': return distance;
        case 'B': return distance * 10;
        case 'C': return distance * 100;
        case 'D': return distance * 1000;
        default: throw new Error();
    }
}
const goHome = (state) => (ant) => {
    const newAnt = { ...ant, loc: ant.type.toLowerCase()};
    return {
        hallwayAnts: state.hallwayAnts.filter(a => a !== ant).map(a => ({...a})).sort((a,b) => a.loc.localeCompare(b.loc)),
        queues: Object.entries(state.queues).reduce((newQueues, [key, queue]) => {
            const clone = queue.filter(a => a !== ant).map(a => ({ ...a}));
            newQueues[key] = key === newAnt.loc ? [...clone, ant] : clone;

            return newQueues;
        }, {}),
        energy: state.energy + calcEnergy(ant.loc, newAnt.loc, ant.type, state),
        prev: state,
    }
}

function goToTheHallway(loc, ant, state) {
    const newAnt = {...ant, loc };
    return {
        hallwayAnts: [...state.hallwayAnts.map(a => ({...a})), newAnt].sort((a,b) => a.loc.localeCompare(b.loc)),
        queues: Object.entries(state.queues).reduce((newQueues, [key, queue]) => {
            const clone = queue.filter(a => a !== ant).map(a => ({...a}));
            newQueues[key] = clone;
            return newQueues;
        }, {}),
        energy: state.energy + calcEnergy(ant.loc, loc, ant.type, state),
        prev: state
    }
}
const hallWayLocations = [l1,l2,r1,r2,h1,h2,h3];
function findNextStates(state) {

    const antsThatCanMove = [...state.hallwayAnts, ...Object.entries(state.queues)
        .filter(([key, queue]) => !queueReady(queue, key.toUpperCase()))
        .map(([_key, queue]) => getNext(queue))];

    const antsThatCanGoHome = antsThatCanMove
        .filter(a => canGoHome(state, a))
        .map(goHome(state));

    if(antsThatCanGoHome.length) {
        return antsThatCanGoHome;
    }
    const headedToTheHallway = antsThatCanMove.filter(a => !state.hallwayAnts.includes(a));
    const unoccupiedHallwayLocs = hallWayLocations.filter(loc => !isOccuped(loc, state));
    return headedToTheHallway
        .flatMap(a => unoccupiedHallwayLocs.map(loc => [loc, a]))
        .filter(([loc, ant]) => !blockedByHs(loc, ant.loc, state))
        .map(([loc, ant]) => goToTheHallway(loc, ant, state));

}

const startingState = {
    hallwayAnts: [],
    queues: {
        'a': [{type: 'A', loc: 'a'}, {type: 'D', loc: 'a'}, {type: 'D', loc: 'a'}, {type: 'B', loc: 'a'}],
        'b': [{type: 'D', loc: 'b'}, {type: 'C', loc: 'b'}, {type: 'B', loc: 'b'}, {type: 'C', loc: 'b'}],
        'c': [{type: 'B', loc: 'c'}, {type: 'B', loc: 'c'}, {type: 'A', loc: 'c'}, {type: 'A', loc: 'c'}],
        'd': [{type: 'D', loc: 'd'}, {type: 'A', loc: 'd'}, {type: 'C', loc: 'd'}, {type: 'C', loc: 'd'}]
    },
    energy: 0,
};
startingState.queues.a.reverse();
startingState.queues.b.reverse();
startingState.queues.c.reverse();
startingState.queues.d.reverse();

const heuristic = (state) => {
    return 16 - Object.entries(state.queues)
        .filter(([key, queue]) => queueReady(queue, key.toUpperCase()))
        .map(([_k, queue]) => queue.length)
        .reduce((a,b) => a + b, 0);
}

const bestToThisSpot = new Map();

let bestSeen = Infinity
function keepFunction(_h1, _h2, state) {
    // if(state.energy === 40174) return false;
    if(_h2 < bestSeen) {
        console.log('closer', _h2);
        bestSeen = _h2;
    }
    const key = JSON.stringify(state.queues) + '|' + JSON.stringify(state.hallwayAnts);
    const energyAtState = bestToThisSpot.get(key) ?? Infinity;
    if(state.energy >= energyAtState ) {
        return false;
    }
    bestToThisSpot.set(key, state.energy);
    return true;
}
console.time();
const ans = bfs(startingState,findNextStates,heuristic,keepFunction, state => state, state => state.energy);

function stateToString(state) {
    const checker = (loc) => isOccuped(loc,state)?.type ?? '.';
    
    return `############# energy:${state.energy}
#${checker(l2)}${checker(l1)}.${checker(h1)}.${checker(h2)}.${checker(h3)}.${checker(r1)}${checker(r2)}#
###${state.queues.a?.[3]?.type ?? '.'}#${state.queues.b?.[3]?.type ?? '.'}#${state.queues.c?.[3]?.type ?? '.'}#${state.queues.d?.[3]?.type ?? '.'}###
  #${state.queues.a?.[2]?.type ?? '.'}#${state.queues.b?.[2]?.type ?? '.'}#${state.queues.c?.[2]?.type ?? '.'}#${state.queues.d?.[2]?.type ?? '.'}#
  #${state.queues.a?.[1]?.type ?? '.'}#${state.queues.b?.[1]?.type ?? '.'}#${state.queues.c?.[1]?.type ?? '.'}#${state.queues.d?.[1]?.type ?? '.'}#
  #${state.queues.a?.[0]?.type ?? '.'}#${state.queues.b?.[0]?.type ?? '.'}#${state.queues.c?.[0]?.type ?? '.'}#${state.queues.d?.[0]?.type ?? '.'}#
  #########`;
}

const path = [];
let next = ans.state;
while(next) {
    path.push(next);
    next = next.prev;
}
path.reverse();
path.map(s => stateToString(s))
.forEach(s => console.log(s));
console.timeEnd();