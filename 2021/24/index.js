import { input, modifiedInput } from './input.js';
import moad from './moad.js';
function ALU() {
    this.registers = {
        w: 0,
        x: 0,
        y: 0,
        z: 0,
    };
}

ALU.prototype.unwrap = function (wrapped) {
    const unwrapped = Number(wrapped);
    return isNaN(unwrapped) ? this.registers[wrapped] : unwrapped;
}

ALU.prototype.inp = function (reg, val) {
    this.registers[reg] = val;
}

ALU.prototype.add = function(reg, wrappedVal) {
    const a = this.unwrap(reg);
    const b = this.unwrap(wrappedVal);
    
    this.registers[reg] = a + b;
}

ALU.prototype.mul = function(reg, wrappedVal) {
    const a = this.unwrap(reg);
    const b = this.unwrap(wrappedVal);
    
    this.registers[reg] = a * b;
}

ALU.prototype.div = function(reg, wrappedVal) {
    const a = this.unwrap(reg);
    const b = this.unwrap(wrappedVal);
    
    this.registers[reg] = Math.floor(a / b);
}

ALU.prototype.mod = function(reg, wrappedVal) {
    const a = this.unwrap(reg);
    const b = this.unwrap(wrappedVal);
    
    this.registers[reg] = a % b;
}

ALU.prototype.eql = function(reg, wrappedVal) {
    const a = this.unwrap(reg);
    const b = this.unwrap(wrappedVal);
    
    this.registers[reg] = a === b ? 1 : 0;
}

ALU.prototype.runProgram = function*(commands) {
    for(let i = 0; i < commands.length; i++) {
        const { command, a, b} = commands[i];
        if(command === 'inp') {
            const val = yield this.registers;
            this.inp(a, val);
        }
        else this[command](a,b);
        // console.log(command, a, b ?? '', this.registers);
    }
    return this.registers
}

function readProgram(str) {
    return str.split('\n')
        .map(line => line.split(' '))
        .map(([command, a, b]) => ({command, a, b}));
}

const commands = readProgram(input);

const testInput = `inp w
add z w
mod z 2
div w 2
add y w
mod y 2
div w 2
add x w
mod x 2
div w 2
mod w 2`;

const testCommands = readProgram(testInput);

let found = false;

function randomDigit() {
    return Math.floor(Math.random() * 8) + 1;
}

function testString(str) {
    const alu = new ALU();
    const digits = str.split('').map(Number);

    const program = alu.runProgram(commands);
    let xVals = [];
    program.next();
    digits.forEach(d =>{
        const snapshot = program.next(d);
        console.log(snapshot.value);
        xVals.push(snapshot.value.x);
    });
    
    // if(xVals.filter(x => x === 0).length > 1) {
    //     console.log(str);
    //     console.log(xVals.join(''));
    // }

    

    return alu.registers.z === 0;

    
}
// 91176568617517
// 91176678186846
console.log(testString('21176121611511'));
console.log(moad('94399898949959'));
// let str;
// let num = 999999999;
// outerLoop: while(num > 0 && !found) {
//     str = "91176" + num;
//     if(str.includes('0')) {
//         for(let i = 0; i < 14; i++) {
//             if(str.charAt(i) === '0') {
//                 // if(i < 10) console.log(str);
//                 num -= Math.pow(10, 13 - i);
//                 continue outerLoop;
//             }
//         }
//     }
//     num--;
//     found = moad(str);
// }

// console.log(str);