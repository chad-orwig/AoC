import { input, test } from './input.js';
/**
 * @class
 * @param {number} y 
 * @param {number} x 
 * @param {number} length 
 * @param {number} val
 */
function PartNumber(y, x, length, val) {
  this.y = y;
  this.x = x;
  this.length = length
  this.val = val;
}

function Symbol(type, x) {
  this.type = type;
  this.x = x;
}

const numberRegex = /(\d+)/g;
const notASymbolRegex = /[\d\.]/;

function checkRow(pn, str) {
  const minX = Math.max(0, pn.x - 1);
  const maxX = Math.min(str.length, pn.x + pn.length + 1);
  const abovStr = str.slice(minX, maxX);
  const index = [...abovStr].findIndex(s => !notASymbolRegex.test(s));
  if (index !== -1) {
    return new Symbol(abovStr.charAt(index), minX + index)
  }
  return false;
}

/**
 * @function
 * @returns {(pn: PartNumber) => boolean}
 * @param {string[]} inp 
 */ 
const partNumberCounts = (inp) => (pn) => {
  const yAbove = pn.y - 1;
  if (yAbove >= 0 && checkRow(pn, inp[yAbove])) return true;
  const yBelow = pn.y + 1;
  if(inp[yBelow] && checkRow(pn, inp[yBelow])) return true;
  const xBefore = pn.x - 1;
  if(xBefore >= 0 && !notASymbolRegex.test(inp[pn.y].charAt(xBefore))) return true;
  const xAfter = pn.x + pn.length;
  if(xAfter < inp[pn.y].length && !notASymbolRegex.test(inp[pn.y].charAt(xAfter))) return true;
  return false;
}

const findGears = (inp) => (pn) => {
  /** @type {string[]} */
  const gears = [];
  const yAbove = pn.y - 1;
  if (yAbove >= 0) {
    const symbol = checkRow(pn, inp[yAbove]);
    if(symbol?.type === '*') {
      gears.push(`${yAbove},${symbol.x}`);
    }
  }
  const yBelow = pn.y + 1;
  if(inp[yBelow]) {
    const symbol = checkRow(pn, inp[yBelow]);
    if(symbol?.type === '*') {
      gears.push(`${yBelow},${symbol.x}`);
    }
  }
  const xBefore = pn.x - 1;
  if(xBefore >= 0 && inp[pn.y].charAt(xBefore) === '*') {
    gears.push(`${pn.y},${xBefore}`);
  }
  const xAfter = pn.x + pn.length;
  if(xAfter < inp[pn.y].length && inp[pn.y].charAt(xAfter) === '*') {
    gears.push(`${pn.y},${xAfter}`);
  }
  return gears;
}

/**
 * @returns {PartNumber[]}
 * @param {PartNumber[]} result 
 * @param {string} row 
 */
function partNumberReducer(result, row, y) {
  const eResult = numberRegex.exec(row);
  if(eResult === null) return result;
  const pn = new PartNumber(y, eResult.index, eResult[0].length, Number(eResult[0]));
  return partNumberReducer([...result, pn], row, y);
}

const schematic = input;

const partNumbers = schematic.flatMap((row, y) => partNumberReducer([], row, y));

const partNumbersThatCount = partNumbers.filter(partNumberCounts(schematic));

const p1 = partNumbersThatCount.map(pn => pn.val)
  .reduce((a,b) => a+b);
console.log(p1);
const gearsToPns = partNumbersThatCount.map(findGears(schematic))
  .flatMap((gears, i) => gears.map( gear => ({ gear, pn: partNumbersThatCount[i] })))
  .reduce((acc, {gear, pn}) => {
    const pns = acc[gear] ?? [];
    pns.push(pn);
    acc[gear] = pns;
    return acc;
  }, {});

const gearRatio = Object.values(gearsToPns)
  .filter((pns) => pns.length === 2)
  .map(pns => pns.map(pn => pn.val))
  .map(pns => pns.reduce((a,b) => a * b))
  .reduce((a,b) => a + b);

console.log(gearRatio);





