const filter = require('lodash/fp/filter');
const flatMap = require('lodash/fp/flatMap');
const flow = require('lodash/fp/flow');
function bfs(startingState, findNextStates, heuristic, keepFunction, hashFunction=JSON.stringify) {
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
        queue = generateStates(queue);
        if(ans.length) return ans[0];
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
        min = Math.min(min, hVal);
        if(hVal === 0){
            ans.push(runObject);
        }

        return !keepFunction || keepFunction(min, hVal);
    };
}

module.exports = bfs;