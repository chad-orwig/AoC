import { input } from './input.js';
import { List, Item } from 'linked-list';

const [ start, rules ] = input;
const ZERO = BigInt('0');
const ONE = BigInt('1');
const TWO = BigInt('2');

/**
 * 
 * @param {string} rules 
 * @returns {Map<string, string>}
 */
function readRules(rules) {
    const rulesMap = new Map();
    rules.split('\n')
        .map(str => str.split(' -> '))
        .forEach(([key, val]) => rulesMap.set(key, val));
    return rulesMap;
}

const rulesMap = readRules(rules);

class Polymer extends Item {
    /**@type {Map<string, number>} */
    static seenCount = new Map();
    static rulesMap = rulesMap;
    /**
     * 
     * @param {string} value 
     */
    constructor(value) {
        super();
        this.value = value;
        const count = Polymer.seenCount.get(value) ?? 0;
        Polymer.seenCount.set(value, count + 1);
    }

    polymerInsertion() {
        if(!this.next) return;
        const newVal = rulesMap.get(`${this.value}${this.next.value}`);
        if(newVal) this.append(new Polymer(newVal));
    }
}
/**@type{List<Polymer>} */
const polymerList = start.split('')
    .map(val => new Polymer(val))
    .reduce((list,polymer) => list.append(polymer).list, new List());

    /**
     * 
     * @param {List<Polymer>} polymerList 
     */
function pairInsertionStep(polymerList) {
    for(let cur = polymerList.head; cur; cur = cur.next?.next) {
        cur.polymerInsertion();
    }
}

for(let i = 0; i < 10; i++) {
    pairInsertionStep(polymerList);
}

function getSeenCounts() {
    return Array.from(Polymer.seenCount.entries())
        .map(([val, count]) => ({ val, count}))
        .sort((a, b) => b.count - a.count);
}

const seenCounts = getSeenCounts();

console.log(seenCounts[0].count - seenCounts[seenCounts.length - 1].count);

// Turns out linked list was not the answer

/**
 * 
 * @param {Map<string,number>} pairs
 * 
 * @returns {Map<string, number>}
 */
function pairInsertion(pairs) {
    return Array.from(pairs.entries())
        .flatMap(([key, count]) => {
            const middle = rulesMap.get(key);
            if(!middle) throw new Error('woops');
            const [k1, k2] = key.split('');
            return [
                [`${k1}${middle}`, count],
                [`${middle}${k2}`, count],
            ];
        })
        .reduce((m, e) => m.set(e[0], (m.get(e[0]) ?? ZERO) + e[1]), new Map());
}

const startingPairs = start.split('')
    .reduce((m, letter, i, arr) => {
        if(!arr[i+1]) return m;
        const key = `${letter}${arr[i + 1]}`;
        const count = m.get(key) ?? ZERO;
        return m.set(key, count + ONE);
    }, new Map());

let currentPairs = startingPairs;
for(let i = 0; i < 40; i++) {
    if(i % 10000 === 0) console.log(i);
    currentPairs = pairInsertion(currentPairs);
}

function getCountsFromPairs(pairs) {
    return Array.from(Array.from(pairs.entries())
        .flatMap(([key, count]) => {
            const [k1, k2] = key.split('');
            return [
                { key: k1, count },
                { key: k2, count },
            ];
        })
        .reduce((m, { key, count }) => m.set(key, (m.get(key) ?? ZERO) + count ), new Map())
        .entries())
        .map(([val, count]) => ( { val, count : ((count + ONE) / TWO) }))
        .sort((a,b) => (a.count < b.count) ? 1 : ((a.count > b.count) ? -1 : 0))

}

const seenCounts2 = getCountsFromPairs(currentPairs);
console.log('complete');
console.error(seenCounts2[0].count - seenCounts2[seenCounts.length - 1].count);
