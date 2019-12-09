const isFunction = require('lodash/isFunction');
const HALT = 99;
const ADD = 1;
const MULT = 2;
const INPUT = 3;
const OUTPUT = 4;
const JUMP_TRUE = 5;
const JUMP_FALSE = 6;
const LESS_THAN = 7;
const EQ = 8;
const BASE_OFFSET = 9;

const POSITION_MODE = 0;
const IMMEDIATE_MODE = 1;
const RELATIVE_MODE = 2;

function halt(arr) {
    console.log(JSON.stringify(arr));
    console.log(arr[0]);
    process.exit();
}

function parseCommand(val) {
    const command = val % 100;
    val = Math.round(val/100);
    const modes = [];
    for(let i = 0; i < 3; i ++) {
        const mode = val % 10;
        val = Math.round(val/10);
        modes.push(mode);
    }
    return {command, modes}
}

function readVal(program, index, mode, base) {
    switch(mode) {
        case POSITION_MODE :
            return program[program[index] || 0] || 0;
        case IMMEDIATE_MODE:
            return program[index] || 0;
        case RELATIVE_MODE:
            return program[base + (program[index] || 0)] || 0;
        default:
            throw `Unknown mode: ${mode}`;
    }
}

function writeVal(program, index, mode, base, value) {
    switch(mode) {
        case IMMEDIATE_MODE:
            throw 'Attempted to write in immediate mode';
        case POSITION_MODE:
            program[program[index]] = value;
            return;
        case RELATIVE_MODE:
            program[base + program[index]] = value;
            return;
        default:
            throw `Unknown mode: ${mode}`;
    }
}

function doOp(index, arr, inputGenerator, base) {
    const {command, modes:[mode1, mode2, mode3]} = parseCommand(arr[index] || 0);
    let val;
    switch(command) {
        case HALT:
            halt(arr);
            return { index: index + 4};
        case ADD:
            writeVal(arr, index + 3, mode3, base, readVal(arr, index + 1, mode1, base) + readVal(arr, index + 2, mode2, base));
            return { index: index + 4};

        case MULT:
            writeVal(arr, index + 3, mode3, base, readVal(arr, index + 1, mode1, base) * readVal(arr, index + 2, mode2, base));
            return { index: index + 4};

        case INPUT:
            writeVal(arr, index + 1, mode1, base, inputGenerator.next().value);
            return { index: index + 2};
        
        case OUTPUT:
            return {
                out : readVal(arr, index + 1, mode1, base),
                index : index + 2
            };
        
        case JUMP_TRUE:
            if(readVal(arr, index + 1, mode1, base)) {
                return { index : readVal(arr, index + 2, mode2, base)};
            }
            return { index: index + 3};

        case JUMP_FALSE:
            if(!readVal(arr, index + 1, mode1, base)) {
                return {index : readVal(arr, index + 2, mode2, base)};
            }
            return { index: index + 3};

        case LESS_THAN:
            val = (readVal(arr, index + 1, mode1, base) < readVal(arr, index + 2, mode2, base)) ? 1 : 0
            writeVal(arr, index + 3, mode3, base, val);
            return { index: index + 4};

        case EQ:
            val = (readVal(arr, index + 1, mode1, base) === readVal(arr, index + 2, mode2, base)) ? 1 : 0
            writeVal(arr, index + 3, mode3, base, val);
            return { index: index + 4};

        case BASE_OFFSET:
            val = readVal(arr, index + 1, mode1, base);
            return {
                index : index + 2,
                adjustment : val
            }
        default:
            throw `Unknown Command ${command} read from ${arr[index]} at index ${index}`;
    }

    
}

function* createInputGenerator(input) {
    const inputIsFunction = isFunction(input);
    while(true) { 
        yield inputIsFunction ? input() : input 
    }
}

function* doProgram(program, input) {
    
    const inputGenerator = input && input.next ? input : createInputGenerator(input);
    const myProgram = [...program];
    let index = 0;
    let base = 0;

    while(myProgram[index] !== 99) {
        const res = doOp(index, myProgram, inputGenerator, base);
        if(res.out !== undefined) {
            yield res.out;
        }
        if(res.adjustment) {
            base += res.adjustment;
        }
        index = res.index;
    }
    return myProgram[0];
}

module.exports = doProgram;
