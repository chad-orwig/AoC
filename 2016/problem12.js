const input = require('./problem12input');

const registers = {
    a: 0,
    b: 0,
    c: 1,
    d: 0
};

const commands = {
    cpy : copyFunction,
    inc : increaseFunction,
    dec : decreaseFunction,
    jnz : jumpFunction
};

let currentCommand = 0;

function copyFunction([amountOrSource, destination]) {
    const amount = paramToNumber(amountOrSource);
    registers[destination] = amount;
    currentCommand++;
}

function increaseFunction([register]) {
    registers[register] += 1;
    currentCommand++;
}

function decreaseFunction([register]) {
    registers[register] -= 1;
    currentCommand++;
}

function jumpFunction([zeroCheck, offset]) {
    const skipFlag = paramToNumber(zeroCheck);

    if(skipFlag) {
        currentCommand += Number(offset);
    }
    else {
        currentCommand++;
    }

}

function paramToNumber(param) {
    if(registers[param] === undefined) {
        return Number(param);
    }
    else {
        return registers[param];
    }
}

while (currentCommand < input.length) {
    const line = input[currentCommand];
    const commandArray = line.split(' ');
    commands[commandArray[0]](commandArray.slice(1));
}
console.log(registers);

