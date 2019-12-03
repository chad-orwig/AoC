

function setRegister(register, param, registers) {
    const value = decodeParam(param, registers);
    registers[register] = value;
}

function increaseRegister(register, param, registers) {
    const value = decodeParam(param, registers);
    const currValue = readRegister(register, registers);
    setRegister(register, currValue + value, registers);
}

function multRegister(register, param, registers) {
    const value = decodeParam(param, registers);
    const currValue = readRegister(register, registers);
    setRegister(register, value * currValue, registers);
}

function modRegister(register, param, registers) {
    const value = decodeParam(param, registers);
    const currValue = readRegister(register, registers);
    setRegister(register, currValue % value, registers);
}

function jump(x, y, registers) {
    const valx = decodeParam(x, registers);
    if(valx > 0) {
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
    'jgz' : jump
};

function programCycle(index, registers, input, myQueue, theirQueue) {

    const {command, params} = input[index];
    const func = commandMap[command];
    return func(...params, registers, myQueue, theirQueue);

}

const input = require('./input');
let index0 = 0;
let index1 = 1;

const registers0 = { p: 0};
const registers1 = { p: 1};

const queue0 = [];
const queue1 = [];
queue1.id = 1;
queue0.id = 0;

while(true) {
    let ran0, ran1;
    if(0 <= index0 && index0 < input.length) {
        ran0 = true;
        const result = programCycle(index0, registers0, input, queue0, queue1);
        if(result === undefined) {
            index0 ++;
        }
        else {
            index0 += result;
        }
    }

    if(0 <= index1 && index1 < input.length) {
        ran1 = true;
        const result = programCycle(index1, registers1, input, queue1, queue0);
        if(result === undefined) {
            index1 ++;
        }
        else {
            index1 += result;
        }
    }
    if(!ran0 && !ran1) {
        console.log(queue1.pushCount);
    }
}

