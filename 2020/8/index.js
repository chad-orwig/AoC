import input, { test } from './input.js';
import BootCode from '../bootCode.js';

function validateProgram(operations) {
    const bootCode = new BootCode();
    const program = bootCode.executionContext(operations);
    const seenInstructions = new Set();
    

    while(
            !seenInstructions.has(bootCode.getIndex()) &&
            bootCode.getIndex() >=0 &&
            bootCode.getIndex() < operations.length
        ) {
        seenInstructions.add(bootCode.getIndex());
        program();
    }

    console.log(bootCode.getAccumulator());
    return bootCode.getIndex() === operations.length ? { bootCode, program} : false;
}

validateProgram(input);

function switchNopJmp(operations, i) {
    const mutatedOperations = [...operations];
    const opToChange = mutatedOperations[i];
    const newOp = {
        operation : opToChange.operation === 'jmp' ? 'nop' : 'jmp',
        arg : opToChange.arg
    };
    mutatedOperations[i] = newOp;
    return mutatedOperations;
}

const mutatedPrograms = input.map(({operation}, i) => {
    switch(operation) {
        case 'nop':
        case 'jmp': return switchNopJmp(input, i);
    }})
    .filter(ops => ops)
    .map(ops => validateProgram(ops))
    .filter(validation => validation)

console.log(mutatedPrograms[0].bootCode.getAccumulator());