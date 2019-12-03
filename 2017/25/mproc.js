let mulCounter = 0;
function setRegister(register, param, registers) {
    const value = decodeParam(param, registers);
    registers[register] = value;
}

function increaseRegister(register, param, registers) {
    const value = decodeParam(param, registers);
    const currValue = readRegister(register, registers);
    setRegister(register, currValue + value, registers);
}

function decreaseRegister(register, param, registers) {
    const value = decodeParam(param, registers);
    return increaseRegister(register, -value, registers);
}

function multRegister(register, param, registers) {
    const value = decodeParam(param, registers);
    const currValue = readRegister(register, registers);
    setRegister(register, value * currValue, registers);
    mulCounter++;
}

function modRegister(register, param, registers) {
    const value = decodeParam(param, registers);
    const currValue = readRegister(register, registers);
    setRegister(register, currValue % value, registers);
}

function jump(x, y, registers) {
    const valx = decodeParam(x, registers);
    if(valx !== 0) {
        return decodeParam(y, registers);
    }
}

function readRegister(register, registers) {
    return registers[register] || 0;
}


function decodeParam(param, registers) {
    if(!param.charCodeAt) {
        return param;
    }
    const charCode = param.charCodeAt(0);
    if(charCode === 45 || (48 <= charCode && charCode <= 57)) {
        return Number(param);
    }
    return readRegister(param, registers);
}

function send(param, registers, myQueue, theirQueue) {
    const value = decodeParam(param, registers);
    theirQueue.push(value);
    const pushCount = myQueue.pushCount || 0;
    myQueue.pushCount = pushCount + 1;
}

function receive(destination, registers, myQueue, theirQueue) {
    if(myQueue.length) {
        const value = myQueue.shift();
        setRegister(destination, value, registers);
        myQueue.deadlock = false;
    }
    else {
        if(myQueue.deadlock && theirQueue.deadlock) {
            console.log(`${myQueue.id}:${myQueue.pushCount}`);
            console.log(`${theirQueue.id}:${theirQueue.pushCount}`);
            process.exit(0);
        }
        myQueue.deadlock = true;
        return 0;
    }
}

const commandMap = {
    'snd' : send,
    'set' : setRegister,
    'add' : increaseRegister,
    'mul' : multRegister,
    'mod' : modRegister,
    'rcv' : receive,
    'jnz' : jump,
    'sub' : decreaseRegister
};

function programCycle(index, registers, input, myQueue, theirQueue) {

    const {command, params} = input[index];
    const func = commandMap[command];
    if(!func) {
        throw 'woops';
    }
    return func(...params, registers, myQueue, theirQueue);

}

function getMulCounter() {
    return mulCounter;
}

module.exports = {
    programCycle,
    getMulCounter
};
