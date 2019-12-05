const input = require('./input');
const test = [2,4,4,5,99,0];
const HALT = 99;
const ADD = 1;
const MULT = 2;

function halt(arr) {
    console.log(JSON.stringify(arr));
    console.log(arr[0]);
    process.exit();
}

function doOp(index, arr) {
    const command = arr[index];
    switch(command) {
        case HALT:
            halt(arr);
            break;
        case ADD:
            arr[arr[index + 3]] = arr[arr[index + 1]] + arr[arr[index + 2]];
            break;

        case MULT:
            arr[arr[index + 3]] = arr[arr[index + 1]] * arr[arr[index + 2]];
            break;
        default:
            throw 'woops';
    }

    return index + 4;
    
}

function doProgram(noun, verb) {
    const program = [...input];
    let index = 0;
    program[1] = noun;
    program[2] = verb;

    while(program[index] !== 99) {
        index = doOp(index, program);
    }
    return program[0];
}


for(let noun = 0; noun <= 99; noun++) {
    for(let verb = 0; verb <= 99; verb++) {
        const result = doProgram(noun, verb);
        if(result === 19690720){
            console.log(100 * noun + verb);
        }
    }
}
