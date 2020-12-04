import {testInput, input} from './input.js';

const centimeters = 'cm';
const inches = 'in';

const required = {
    'byr': v => /^\d{4}$/.test(v) && Number(v) >= 1920 && Number(v) <= 2002,
    'iyr': v => /^\d{4}$/.test(v) && Number(v) >= 2010 && Number(v) <= 2020,
    'eyr': v => /^\d{4}$/.test(v) && Number(v) >= 2020 && Number(v) <= 2030,
    'hgt':v => {
        const result = /^(\d+)(in|cm)$/.exec(v);
        if(!result) return false;

        const [_, numString, unit] = result;
        const num = Number(numString);
        switch(unit){
            case centimeters: return num >= 150 && num <= 193;
            case inches: return num >= 59 && num <= 76;
            default: throw new Error(`Unexpected unit case ${unit}`);
        }
    },
    'hcl': (v) => /^#[0-9a-f]{6}$/.test(v),
    'ecl': (v) => v === 'amb' || v === 'blu' || v === 'brn' || v === 'gry' || v === 'grn' || v === 'hzl' || v === 'oth',
    'pid': (v) => /^\d{9}$/.test(v)
};

function splitIntoPassports(input) {
    const passports = input
        .split(/\n\n/)
        .map(str => str.split(/:|\s+/))
        .map(commandArray => commandArray.reduce((passport, curr, index, arr) => {
            const key = arr[index - 1];
            if (index % 2) passport[key] = curr;
            return passport;
        }, {}))
    return passports;
}

function validPassport1(passport) {
    return Object.keys(required).reduce((curr, key) => {
        return curr && !!passport[key]
    }, true);
}

function validPassport2(passport) {
    return Object.entries(required).reduce((curr, [key, test]) => {
        const ans =  curr && !!passport[key] && test(passport[key]);
        return ans;
    }, true);
}



console.log(splitIntoPassports(testInput).filter(validPassport1).length);
console.log(splitIntoPassports(input).filter(validPassport1).length);

console.log(splitIntoPassports(testInput).filter(validPassport2).length);
console.log(splitIntoPassports(input).filter(validPassport2).length);