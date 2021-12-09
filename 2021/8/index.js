import { input } from "./input.js";

const setOfUnique = new Set([2,3,4,7]);
const uniqueCount = input.flatMap(i => i.outputs)
    .filter(o => setOfUnique.has(o.length))
    .length;

console.log(uniqueCount);

function solveEntry({ inputs, outputs }) {
    const all = [...inputs, ...outputs ];

    const one = all.filter(entry => entry.length === 2)?.[0];
    const four = all.filter(entry => entry.length === 4)?.[0];
    const seven = all.filter(entry => entry.length === 3)?.[0];
    const eight = all.filter(entry => entry.length === 7)?.[0];

    const sevenLetters = seven.split('');
    const six = all
        .filter(entry => entry !== eight)
        .map(str => {
            const withoutSeven = sevenLetters.reduce((str, letter) => str.replace(letter, ''), str);
            return { withoutSeven, str }
        })
        .filter(({withoutSeven}) => withoutSeven.length === 4)
        .map(({str}) => str)?.[0];

    const zerosAndNines = all
        .filter(entry => entry.length === 6)
        .filter(entry => entry !== six);
    
    const fourLetters = four.split('');

    const nine = zerosAndNines
        .map(str => {
            const withoutFour = fourLetters.reduce((str, letter) => str.replace(letter, ''), str);
            return { withoutFour, str }
        })
        .filter(({withoutFour}) => withoutFour.length === 2)
        .map(({str}) => str)?.[0];
    const zero = zerosAndNines.filter(entry => entry !== nine)?.[0];

    const twosThreesFives = all.filter(entry => entry.length === 5);

    const two = twosThreesFives
        .map(str => {
            const withoutFour = fourLetters.reduce((str, letter) => str.replace(letter, ''), str);
            return { withoutFour, str }
        })
        .filter(({withoutFour}) => withoutFour.length === 3)
        .map(({str}) => str)?.[0];

    const three = twosThreesFives
        .map(str => {
            const withoutSeven = sevenLetters.reduce((str, letter) => str.replace(letter, ''), str);
            return { withoutSeven, str }
        })
        .filter(({withoutSeven}) => withoutSeven.length === 2)
        .map(({str}) => str)?.[0];

    const five = twosThreesFives
        .filter(entry => entry !== two)
        .filter(entry => entry !== three)?.[0];

    const map = new Map();

    map.set(zero, 0);
    map.set(one, 1);
    map.set(two, 2);
    map.set(three, 3);
    map.set(four, 4);
    map.set(five, 5);
    map.set(six, 6);
    map.set(seven, 7);
    map.set(eight, 8);
    map.set(nine, 9);
    return map;
}
const maps = input.map(solveEntry);
const pt2 = input.map(({outputs}, i) => {
    const map = maps[i];

    return outputs
        .map(entry => map.get(entry))
        .reduce((str, num) => str + num, '')
})
.map(Number)
.reduce((a,b) => a + b);

console.log(pt2);