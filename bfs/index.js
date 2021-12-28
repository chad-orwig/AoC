const filter = require('lodash/fp/filter');
const flatMap = require('lodash/fp/flatMap');
const flow = require('lodash/fp/flow');
const orderBy = require('lodash/fp/orderBy');
const PriorityQueue = require('../PriorityQueue');
/**
 * @template T
 * @param {T} startingState 
 * @param {function(T,number?): T[]} findNextStates 
 * @param {function(T): number} heuristic 
 * @param {function(number, number, T):boolean} [keepFunction]
 * @param {function(T):any} [hashFunction]
 * @param {function(T):number} [calcCost]
 * @returns 
 */
function bfs(startingState, findNextStates, heuristic, keepFunction, hashFunction=JSON.stringify, calcCost) {
    const memoizedCalcCost = ((calcCost) => {
        const seenMap = new Map();
        return (step) => {
            const cost = seenMap.get(step.state) ?? (calcCost ? calcCost(step.state): step.steps);
            seenMap.set(step.state, cost);
            return cost;
        }
    })(calcCost);
    const writeThrough = makeWriteThrough(hashFunction);
    let queue = new PriorityQueue((a, b) => memoizedCalcCost(a) < memoizedCalcCost(b));
    queue.push({
        state : startingState,
        steps : 0
    });
    const visited = new Set();
    writeThrough(visited, startingState);
    const ans = [];
    const generateStates = flow(
        flatMap(stateGenerator(findNextStates)),
        filter((step) => writeThrough(visited, step.state)),
        filter(checkHeuristic(heuristic, keepFunction, startingState))
    );
    let count = 0;
    console.time('100k');
    while(queue.size()) {
        count++;
        const topState = queue.pop();
        if(count === 100000) {
            // console.log(topState);
            console.timeEnd('100k');
            console.time('100k');
            count = 0;
        }
        if(topState.hVal === 0) {
            // console.log(queue.slice(queue.length - 10));
            return topState;
        }
        const newStates = generateStates([topState]);
        queue.push(...newStates);
        // newStates.forEach(state => queue.push(state));
        // queue = queue.filter(filterWithHeruisticAndKeepFunction);
        // queue.sort((a,b) => b.state.energy - a.state.energy);
        
    }
}

function stateGenerator(findNextStates) {
    return ({state:prev, steps}) => {
        const states = findNextStates(prev, steps);
        return states.map(state =>({
            state,
            prev,
            steps : steps + 1
        }));
    }
}

function makeWriteThrough(hashFunction){
    return (visited, state) => {
    const stringified = hashFunction(state);
        if(visited.has(stringified)) return false;

        visited.add(stringified);
        return true;
    };
}

function checkHeuristic(heuristic, keepFunction, start) {
    let min = heuristic(start);
    return (runObject) => {
        const hVal = heuristic(runObject.state);
        const newMin = Math.min(min, hVal);
        min = newMin;
        runObject.hVal = hVal;
        // if(hVal === 0) console.log('potential', runObject)

        return !keepFunction || keepFunction(min, hVal, runObject.state);
    };
}

module.exports = bfs;