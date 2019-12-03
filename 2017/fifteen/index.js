const _ = require('lodash');
const aMult = 16807, bMult = 48271;
const aReq = 4, bReq = 8;
const modAmt = 2147483647;

function nextVal(currentVal, multiplier, modAmt) {
    return (currentVal * multiplier) % modAmt;
}

function pickyNextVal(currentVal, multiplier, modAmt, req) {
    let nv = nextVal(currentVal, multiplier, modAmt);
    return (nv % req) === 0 ? nv : pickyNextVal(nv, multiplier,modAmt, req);
}

function judgeCompare(a, b) {
    const xor = a ^ b;
    let binaryString = xor.toString(2);
    if(binaryString.length > 16) {
        binaryString = binaryString.substr(binaryString.length - 16);
    }
    return _.sumBy(binaryString, c => c === '0');
}

let sum = 0;
let aVal = 277;
let bVal = 349;
for(let i = 0; i < 5000000; i++) {
    aVal = pickyNextVal(aVal, aMult, modAmt, aReq);
    bVal = pickyNextVal(bVal, bMult, modAmt, bReq);
    const judgement = judgeCompare(aVal, bVal);
    if(judgement === 16) {
        sum ++;
        console.log(sum);
    }
}