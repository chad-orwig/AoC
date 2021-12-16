const filter = require('lodash/fp/filter');
const flatMap = require('lodash/fp/flatMap');
const flow = require('lodash/fp/flow');
const orderBy = require('lodash/fp/orderBy');
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
function bfs(startingState, findNextStates, heuristic, keepFunction, hashFunction=JSON.stringify, calcCost=()=>0) {
    const memoizedCalcCost = ((calcCost) => {
        const seenMap = new Map();
        return (step) => {
            const cost = seenMap.get(step.state) ?? calcCost(step.state);
            seenMap.set(step.state, cost);
            return cost;
        }
    })(calcCost);
    const writeThrough = makeWriteThrough(hashFunction);
    let queue = [{
        state : startingState,
        steps : 0
    }];
    const visited = new Set();
    writeThrough(visited, startingState);
    const ans = [];
    const generateStates = flow(
        flatMap(stateGenerator(findNextStates)),
        filter((step) => writeThrough(visited, step.state)),
        filter(checkHeuristic(heuristic, keepFunction, startingState, ans))
    );
    while(queue.length) {
        const topState = queue.pop();
        const newStates = generateStates([topState]);
        newStates.forEach(state => queue.push(state));
        // queue = queue.filter(filterWithHeruisticAndKeepFunction);
        queue.sort((a,b) => memoizedCalcCost(b) - memoizedCalcCost(a));
        if(ans.length) return orderBy(memoizedCalcCost, 'asc', ans);
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

function checkHeuristic(heuristic, keepFunction, start, ans) {
    let min = heuristic(start);
    return (runObject) => {
        const hVal = heuristic(runObject.state);
        const newMin = Math.min(min, hVal);
        min = newMin;
        if(hVal === 0){
            ans.push(runObject);
        }

        return !keepFunction || keepFunction(min, hVal, runObject.state);
    };
}

module.exports = bfs;