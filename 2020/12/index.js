import input from './input.js';

const facings = [ 'N', 'E', 'S', 'W'];

function turn(currentFacing, direction, val) {
    const turnAmount = val === 90 ? 1 : val === 180 ? 2 : val === 270 ? 3 : undefined
    if(!turnAmount) throw new Error(`Unknown turn value ${val}`);
    
    switch(direction) {
        case 'L': return (currentFacing + 4 - turnAmount) % 4;
        case 'R': return (currentFacing + turnAmount) % 4;
        default: throw new Error(`Unknown turn direction ${direction}`);
    }
}

const state = {
    x: 0,
    y: 0,
    facing: 1
};

const travelInDirection = (state, direction, val, xval = 'x', yval = 'y') => {
    switch(direction) {
        case 'N':
            state[yval] -= val;
            break;
        case 'E':
            state[xval] += val;
            break;
        case 'S':
            state[yval] += val;
            break;
        case 'W':
            state[xval] -= val;
            break;

        default:
            throw new Error(`Unknown travel direction ${direction}`);
    }
}

const travel = (state) => ({direction, val}) => {
    
    switch(direction) {
        case 'N':
        case 'E':
        case 'S':
        case 'W':
            travelInDirection(state, direction, val)
            break;
        case 'L':
        case 'R':
            state.facing = turn(state.facing, direction, val)
            break;
        case 'F':
            travelInDirection(state, facings[state.facing], val);
            break;
        default:
            throw new Error(`Unknown travel direction ${direction}`);
    }
};

input.forEach(travel(state));

console.log(state);
console.log(Math.abs(state.x) + Math.abs(state.y));

const rotate = (state, amount) => {
    const { wx, wy } = state;
    switch(amount) {
        case 1:
            state.wy = wx * -1
            state.wx = wy;
            break;
        case 2:
            state.wy = wy * -1;
            state.wx = wx * -1;
            break;
        case 3:
            state.wy = wx;
            state.wx = wy * -1
            break;
        default: throw new Error(`Unknown rotate amount ${amont}`);

    }
};

const forward = (state, value) => {
    state.sx += state.wx * value;
    state.sy += state.wy * value;
}

const pt2 = (state) => ({direction, val}) => {
    switch(direction) {
        case 'N':
        case 'E':
        case 'S':
        case 'W':
            travelInDirection(state, direction, val, 'wx', 'wy')
            break;
        case 'L':
            rotate(state, val / 90)
            break;
        case 'R':
            const rightAmount = val / 90;
            const leftAmount = rightAmount === 3 ? 1 : rightAmount === 1 ? 3 : 2;
            rotate(state, leftAmount);
            break;
        case 'F':
            forward(state, val);
    }
}

const pt2State = {
    sx: 0,
    sy: 0,
    wx: 10,
    wy: -1,
};

input.forEach(pt2(pt2State));

console.log(pt2State);
console.log(Math.abs(pt2State.sx) + Math.abs(pt2State.sy));