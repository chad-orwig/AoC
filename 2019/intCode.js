const HALT = 99;
const ADD = 1;
const MULT = 2;
const SAVE = 3;
const OUTPUT = 4;
const JUMP_TRUE = 5;
const JUMP_FALSE = 6;
const LESS_THAN = 7;
const EQ = 8;

const POSITION_MODE = 0;
const IMMEDIATE_MODE = 1;

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

function readVal(program, index, mode) {
    switch(mode) {
        case POSITION_MODE :
            return program[program[index]];
        case IMMEDIATE_MODE:
            return program[index];
        default:
            throw `Unknown mode: ${mode}`;
    }
}

function doOp(index, arr, input) {
    const {command, modes:[mode1, mode2, mode3]} = parseCommand(arr[index]);
    let val;
    switch(command) {
        case HALT:
            halt(arr);
            return index + 4;
        case ADD:
            arr[arr[index + 3]] = readVal(arr, index + 1, mode1) + readVal(arr, index + 2, mode2);
            return index + 4;

        case MULT:
            arr[arr[index + 3]] = readVal(arr, index + 1, mode1) * readVal(arr, index + 2, mode2);
            return index + 4;

        case SAVE:
            arr[arr[index + 1]] = input;
            return index + 2;
        
        case OUTPUT:
            console.log(readVal(arr, index + 1, mode1));
            return index + 2;
        
        case JUMP_TRUE:
            if(readVal(arr, index + 1, mode1)) {
                return readVal(arr, index + 2, mode2);
            }
            return index + 3;

        case JUMP_FALSE:
            if(!readVal(arr, index + 1, mode1)) {
                return readVal(arr, index + 2, mode2);
            }
            return index + 3;

        case LESS_THAN:
            val = (readVal(arr, index + 1, mode1) < readVal(arr, index + 2, mode2)) ? 1 : 0
            arr[arr[index + 3]] = val;
            return index + 4;

        case EQ:
            val = (readVal(arr, index + 1, mode1) === readVal(arr, index + 2, mode2)) ? 1 : 0
            arr[arr[index + 3]] = val;
            return index + 4;
        default:
            throw `Unknown Command ${command} read from ${arr[index]} at index ${index}`;
    }

    
}

function doProgram(program, input) {
    const myProgram = [...program];
    let index = 0;

    while(myProgram[index] !== 99) {
        index = doOp(index, myProgram, input);
    }
    return myProgram[0];
}

module.exports = doProgram;
