import input, {test, test2} from './input.js';

const mem = 'mem';
const mask = 'mask';

console.log(input.slice(0,3));

function maskValue(bitmask, value) {
    const binary = value
        .toString(2)
        .padStart(36, '0')
        .split('');

    bitmask.forEach((val, i) => {
        switch(val) {
            case '1':
            case '0':
                binary[i] = val;
                break;
        }
    });
    return parseInt(binary.join(''), 2);
}

function programReducer(state, cmd) {
    switch(cmd.type) {
        case mem:
            state.map.set(cmd.index, maskValue(state.mask, cmd.value));
            break;
        case mask:
            state.mask = cmd.mask;
            break;
    }
    return state;
}

const result1 = input.reduce(programReducer, { map: new Map()});

const sum = [...result1.map.values()]
    .reduce((a,b) => a + b);

console.log(sum);

function unwrapFloatingIndex(binary) {
    const permutations = binary.reduce((arrays, value, i) => {
        if(value === 'X') {
            return arrays.flatMap(arr => {
                const with1 = [...arr];
                const with0 = [...arr];
                with1[i] = '1';
                with0[i] = '0';
                return [with1, with0];
            });
        }
        if(value === '1') {
            arrays.forEach(arr => arr[i] = '1');
        }

        return arrays;
    }, [binary]);
    return permutations.map(arr => parseInt(arr.join(''), 2));
}

function maskIndex(bitmask, index) {
    const binary = index
        .toString(2)
        .padStart(36, '0')
        .split('');

    bitmask.forEach((val, i) => {
        switch(val) {
            case '1':
            case 'X':
                binary[i] = val;
                break;
        }
    });
    return unwrapFloatingIndex(binary);
}

function programReducer2(state, cmd) {
    switch(cmd.type) {
        case mem:
            const addresses = maskIndex(state.mask, cmd.index);
            addresses.forEach(address => state.map.set(address, cmd.value));
            break;
        case mask:
            state.mask = cmd.mask;
            break;
    }
    return state;
}

const result2 = input.reduce(programReducer2, { map: new Map()});

const sum2 = [...result2.map.values()]
    .reduce((a,b) => a + b);

console.log(sum2);