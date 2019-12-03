const input = require('./input');
const registers = {};
const _ = require('lodash');
const condMap = {
    '>' : (register, value) => getRegisterValue(register) > value,
    '<' : (register, value) => getRegisterValue(register) < value,
    '>=': (register, value) => getRegisterValue(register) >= value,
    '<=': (register, value) => getRegisterValue(register) <= value,
    '==': (register, value) => getRegisterValue(register) === value,
    '!=': (register, value) => getRegisterValue(register) !== value
};
let maxEver = 0;
function getRegisterValue(key) {
    if(registers[key] === undefined) {
        registers[key] = 0;
    }
    return registers[key];
}
function changeRegisterValue(direction, key, value) {
    const realValue = direction === 'dec' ? value * -1 : value;
    const currentValue = getRegisterValue(key);
    registers[key] = currentValue + realValue;
    maxEver = Math.max(maxEver, registers[key]);
}

function checkConditional(conditionalRegister, conditional, conditionalValue) {
    const func = condMap[conditional];
    return func(conditionalRegister, conditionalValue);
}

input.forEach(line => {
    const {register, direction, value, conditionRegister, conditional, conditionValue} = line;
    if(checkConditional(conditionRegister, conditional, conditionValue)) {
       changeRegisterValue(direction, register, value);
    }
});

const registerResults = _.map(registers, (v, r) => {
    return { r, v};
});
console.log(registerResults);
const max = _.maxBy(registerResults, 'v');
console.log(max);
console.log(maxEver);
