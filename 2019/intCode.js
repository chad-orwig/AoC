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

function getOrDefault(program, index) {
    return program[index] || 0;
}

function nestedGetOrDefault(program, index, base=0) {
    return getOrDefault(program, getOrDefault(program, index) + base);
}

function readVal(program, index, mode, base) {
    switch(mode) {
        case POSITION_MODE :
            return nestedGetOrDefault(program, index);
        case IMMEDIATE_MODE:
            return getOrDefault(program, index);
        case RELATIVE_MODE:
            return nestedGetOrDefault(program, index, base);
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

function add(program, index, [mode1, mode2, mode3], base) {
    const sum = 
        readVal(program, index + 1, mode1, base) + 
        readVal(program, index + 2, mode2, base);
    writeVal(program, index + 3, mode3, base, sum);
    return { index: index + 4};
}

function mult(program, index, [mode1, mode2, mode3], base) {
    const product = 
        readVal(program, index + 1, mode1, base) * 
        readVal(program, index + 2, mode2, base)

    writeVal(program, index + 3, mode3, base, product);
    return { index: index + 4};
}

function lt(program, index, [mode1, mode2, mode3], base) {
    const param1 = readVal(program, index + 1, mode1, base);
    const param2 = readVal(program, index + 2, mode2, base);
    const val = param1 < param2 ? 1 : 0
    writeVal(program, index + 3, mode3, base, val);
    return { index: index + 4};
}

function eq(program, index, [mode1, mode2, mode3], base) {
    const param1 = readVal(program, index + 1, mode1, base);
    const param2 = readVal(program, index + 2, mode2, base)
    const val = param1 === param2 ? 1 : 0
    writeVal(program, index + 3, mode3, base, val);
    return { index: index + 4};
}

function jump(program, index, [mode1, mode2], base, ifTrue) {
    if(!!readVal(program, index + 1, mode1, base) === ifTrue) {
        return { index : readVal(program, index + 2, mode2, base)};
    }
    return { index: index + 3};
}

function doOp(index, program, inputGenerator, base) {
    const {command, modes} = parseCommand(getOrDefault(program, index));
    switch(command) {
        case HALT:
            halt(program);
            return { index: index + 4};
        case ADD:
            return add(program, index, modes, base);

        case MULT:
            return mult(program, index, modes, base);

        case INPUT:
            writeVal(program, index + 1, modes[0], base, inputGenerator.next().value);
            return { index: index + 2};
        
        case OUTPUT:
            return {
                out : readVal(program, index + 1, modes[0], base),
                index : index + 2
            };
        
        case JUMP_TRUE:
            return jump(program, index, modes, base, true);

        case JUMP_FALSE:
            return jump(program, index, modes, base, false);

        case LESS_THAN:
            return lt(program, index, modes, base);

        case EQ:
            return eq(program, index, modes, base);

        case BASE_OFFSET:
            return {
                index : index + 2,
                adjustment : readVal(program, index + 1, modes[0], base)
            }
        default:
            throw `Unknown Command ${command} read from ${program[index]} at index ${index}`;
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
