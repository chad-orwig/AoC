import { input, testInput } from "./input.js";

const openersToClosers = new Map([
    ['(', ')'],
    ['[', ']'],
    ['{', '}'],
    ['<', '>'],
]);

const openers = new Set(openersToClosers.keys());
const closers = new Set(openersToClosers.values());

/**
 * 
 * @param {string[]} line 
 */
function findLineErrors(line) {
    const openerQueue = []

    return line.reduce((foundCharacter, character) => {
        if(foundCharacter) return foundCharacter;
        if(openers.has(character)) {
            openerQueue.push(character);
            return null;
        }
        else if(closers.has(character)) {
            if(openerQueue.length === 0) return character;
            const opener = openerQueue.pop();
            const expectedCloser = openersToClosers.get(opener);
            if(character !== expectedCloser) return character;
            return null;
        }
        else {
            throw new Error(`Unknown character ${character}`);
        }
    }, null) ?? openerQueue;
}

const illegalCharacterScoreMap = new Map([
    [')', 3],
    [']', 57],
    ['}', 1197],
    ['>', 25137]
]);

const lineErrors = input
    .map(findLineErrors);

const illegalCharacterScore = lineErrors
    .filter(v => typeof v === 'string')
    .map(c => illegalCharacterScoreMap.get(c))
    .reduce((a,b) => a + b);

console.log(illegalCharacterScore);

const autoCompleteScoreMap = new Map([
    [')', 1],
    [']', 2],
    ['}', 3],
    ['>', 4],
]);

function median(array) {
    return array[Math.floor(array.length / 2)]
}


const autoCompleteScores = lineErrors
    .filter(v => typeof v === 'object')
    .map(queue => queue.map(opener => openersToClosers.get(opener)))
    .map(queue => queue.reverse())
    .map(queue => queue.reduce((score, closer) => (score * 5) + autoCompleteScoreMap.get(closer), 0))
    .sort((a,b) => b - a);
console.log(median(autoCompleteScores));