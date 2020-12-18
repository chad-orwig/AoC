import input, {rawEx, raw, parseRow} from './input.js';
const Symbols =  {
    openParen : "(",
    closeParen: ")",
    mult      : "*",
    add       : "+",
}

const add = (a) => (b) => a + b;
const mult = (a) => (b) => a * b;

const quickMaths = ({depth, depthValueMap}, value) => {
    switch(value) {
        case Symbols.openParen: return { depth: depth+1, depthValueMap};
        case Symbols.closeParen: {
            const val = depthValueMap.get(depth);
            depthValueMap.delete(depth);
            return quickMaths({ depth: depth-1, depthValueMap}, val);
        }
        case Symbols.add:
            depthValueMap.set(depth, add(depthValueMap.get(depth)));
            break;
        case Symbols.mult:
            depthValueMap.set(depth, mult(depthValueMap.get(depth)));
            break;
        default:
            if(depthValueMap.has(depth)) depthValueMap.set(depth, depthValueMap.get(depth)(Number(value)));
            else depthValueMap.set(depth, Number(value));
    }
    return { depth, depthValueMap };
};

const solveRow = (row) => row
    .reduce(quickMaths, { depth: 0, depthValueMap: new Map()})
    .depthValueMap
    .get(0);

const ex1 = '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2'
    .split('')
    .filter(c => c !== ' ');
const ex2 = '1 + (2 * 3) + (4 * (5 + 6))'
    .split('')
    .filter(c => c !== ' ');
console.log(solveRow(ex1));
console.log(solveRow(ex2));

const pt1 = input
    .map(solveRow)
    .reduce((a,b) => a + b);

console.log(pt1);

const wrapAllNonMult = (str) => {
    const index = str.indexOf("*");
    if(index === -1) return "(" + str + ")";

    return "(" + str.substring(0, index) + ")" + "*" + wrapAllNonMult(str.substring(index + 1));
}

const solveRawRow = (str) => {
    const wrapped = wrapAllNonMult(str);
    const parsed = parseRow(wrapped);
    return solveRow(parsed);
}

const solveParens = (str) => {
    const regexResult = /\([^\(\)]*\)/.exec(str);
    if(!regexResult || !regexResult[0].length) return solveRawRow(str);
    const paren = regexResult[0];
    const solvedParen = str.substring(0, regexResult.index) +
        solveRawRow(paren.substring(1, paren.length - 1)) +
        str.substring(regexResult.index + paren.length);
    return solveParens(solvedParen);
}

console.log(rawEx.map(solveParens));

const pt2 = raw
    .map(solveParens)
    .reduce((a,b) => a + b);

console.log(pt2);