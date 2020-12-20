export default function dfs(initialState, nextStates, isComplete) {
    const states = nextStates(initialState);
    // if(states.length === 1 && states[0].grid.length === 12) console.log(states[0]);
    const finished = states.find(isComplete);
    return finished || states.reduce((acc, state) => acc || dfs(state, nextStates, isComplete), null);
}