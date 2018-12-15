const _ = require('lodash');
function bfs(startingState, findNextStates, heuristic, keepFunction) {
    const queue = [{
        state : startingState,
        steps : 0
    }];
    const visited = {};
    visited[JSON.stringify(startingState)] = true;
    let closest = heuristic(startingState);
    while(queue.length) {
        const currentState = queue.shift();
        const nextStates = findNextStates(currentState.stateInput);
        const removeVisited = _.filter(nextStates, state => {
            const stateString = JSON.stringify(state);
            if(visited[stateString]) {
                return false;
            }
            visited[stateString] = true;
            return true;
        });
        for(let i = 0; i < removeVisited.length; i++) {
            const newState = removeVisited[i];
            const hVal = heuristic(newState);
            if(hVal === 0) {
                return {
                    state : newState,
                    prev  : currentState,
                    steps : currentState.steps + 1
                };
            }
            closest = Math.min(closest, hVal);
            if(!keepFunction || keepFunction(closest, hVal)) {
                queue.push({
                    state : newState,
                    prev  : currentState,
                    steps : currentState.steps + 1
                });
            }
        }

    }
}

module.exports = bfs;