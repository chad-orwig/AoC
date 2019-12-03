const bracketRegex = /\[\w*\]/;
const nonBracketRegex = /\w*\[|\]\w*/;
const _ = require('lodash');
const input = require('./problem7input');


function supportsTLS(word) {
    const brackets = findBrackets(word);
    for(let i = 0; i < brackets.length; i++) {
        if(containsABBA(brackets[i])) {
            return false;
        }
    }
    const nonBrackets = findNonBrackets(word);
    for(let i = 0; i < nonBrackets.length; i++) {
        if(containsABBA(nonBrackets[i])) {
            return true;
        }
    }
    return false;
}
function findNonBrackets(word) {
    return _.filter(word.split(bracketRegex));
}

function findBrackets(word) {
    return _.filter(word.split(nonBracketRegex));
}

function containsABBA(word) {
    for(let i = 1; i < word.length - 2; i++) {
        if(
            word.charAt(i) === word.charAt(i + 1) &&
            word.charAt(i - 1) !== word.charAt(i) &&
            word.charAt(i - 1) === word.charAt(i + 2)
        ) {
            return true;
        }
    }

    return false;
}

// part 1
// const supporters = _.filter(input, supportsTLS);
//
// console.log(supporters.length);

function containsABA(word) {
    const abas = [];
    for(let i = 1; i < word.length - 1; i++) {
        if(
            word.charAt(i) !== word.charAt(i + 1) &&
            word.charAt(i - 1) === word.charAt(i + 1)
        ) {
            abas.push([word.charAt(i), word.charAt(i + 1)]);
        }
    }
    return (abas.length ? abas : false);
}

function containsBAB(word, abaArray) {
    const bab = abaArray[0] + abaArray[1] + abaArray[0];
    const babRegex = new RegExp(bab);

    return babRegex.test(word);
}

function supportsSSL(word) {
    const brackets = findBrackets(word);
    const nonBrackets = findNonBrackets(word);
    for(let i = 0; i < nonBrackets.length; i++) {
        const abas = containsABA(nonBrackets[i]);
        if(abas) {
            for(let j = 0; j < abas.length; j++) {
                for(let k = 0; k < brackets.length; k++) {
                    if(containsBAB(brackets[k], abas[j])) {
                        return true;
                    }
                }
            }
        }

    }
    return false;
}

const supporters = _.filter(input, supportsSSL);

console.log(supporters.length);
