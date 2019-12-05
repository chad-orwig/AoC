const range = require('lodash/range');
const start = 136760;
const end = 595730;
function sixDigits(digits) {
    return digits.length === 6;
}


function hasAdjacent(digits) {
    let digitCheck = digits[0];
    let matchOne = false;
    let matchMore = false;

    for(let i = 1; i < digits.length; i++) {
        const digit = digits[i];
        if(digitCheck === digit) {
            if(matchOne) {
                matchMore = true;
            }
            else {
                matchOne = true;
            }
        }
        else {
            if(matchOne && !matchMore) {
                break;
            }
            else {
                matchOne = false;
                matchMore = false;
                digitCheck = digit;
            }
        }
    }

    return matchOne && !matchMore;

}

function neverDecrease(digits) {
    return digits.reduce((prev, digit) => {
        if(prev === false) {
            return false;
        }
        if(prev === undefined) {
            return digit;
        }
        if(prev > digit) {
            return false;
        }
        return digit;
    }, undefined) !== false;
}

const test = (111122).toString().split('').map(Number)

console.log(neverDecrease(test));
console.log(hasAdjacent(test));

const result = range(start, end)
    .map(num => num.toString())
    .map(numString => numString.split(''))
    .map(stringArray => stringArray.map(Number))
    .filter(hasAdjacent)
    .filter(neverDecrease);

console.log(result.length);