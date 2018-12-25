const _ = require('lodash');
function bfs(startingState, findNextStates, heuristic, keepFunction, customWriteThroughFunction, customInsertFunction) {
    const insert = customInsertFunction || defaultInsert;
    const writeThrough = customWriteThroughFunction || defaultWriteThrough;
    const queue = [];
    insert(queue, {
        state : startingState,
        steps : 0
    });
    const visited = {};
    writeThrough(visited, startingState);
    let closest = heuristic(startingState);
    const ans =[];
    while(queue.length) {
        const currentState = queue.shift();
        if(ans.steps && currentState.steps >= ans.steps) {
            return ans;
        }
        const nextStates = findNextStates(currentState.state, currentState.steps);
        const removeVisited = _.filter(nextStates, state => {
            return writeThrough(visited, state);
        });
        for(let i = 0; i < removeVisited.length; i++) {
            const newState = removeVisited[i];
            const hVal = heuristic(newState);
            if(hVal === 0) {
                ans.push({
                    state : newState,
                    prev  : currentState,
                    steps : currentState.steps + 1
                });
                ans.steps = currentState.steps + 1;
            }
            closest = Math.min(closest, hVal);
            if(!keepFunction || keepFunction(closest, hVal)) {
                insert(queue,{
                    state : newState,
                    prev  : currentState,
                    steps : currentState.steps + 1
                });
            }
        }

    }
}

function defaultInsert(queue, state) {
    queue.push(state);
}

function defaultWriteThrough(visited, state) {
    const stringified = JSON.stringify(state);
    if(visited[stringified]) return false;

    visited[stringified] = true;
    return true;
}

module.exports = bfs;