import { input as history } from './input.js';

const isZero = (n) => n === 0;

/**
 * @param {number[]} arr 
 * @returns {number[] | null}
 */
function calcDiff(arr) {
  if(arr.every(isZero)) return null;

  return arr.slice(1).map((n,i) => n - arr[i]);
}

const historyDiffs = history.map(arr => {
  const diffs = [arr];
  let newDiff = arr;
  while((newDiff = calcDiff(newDiff)) !== null) {
    diffs.push(newDiff);
  }
  diffs.reverse();
  return diffs;
});

/**
 * 
 * @param {number[][]} diffs 
 * @returns {number[][]}
 */
function addToHistory(diffs) {
  /** @type {number[]} */
  let prev = []
  return diffs.map((diff,i) => {
    let nextVal;
    if (i === 0) nextVal = 0;
    else {
      nextVal = prev[prev.length - 1] + diff[diff.length - 1];
    }
    prev = [...diff, nextVal];
    return prev;
  });
}


/**
 * 
 * @param {number[][]} diffs 
 * @returns {number[][]}
 */
function subtractFromHistory(diffs) {
  /** @type {number[]} */
  let prev = []
  return diffs.map((diff,i) => {
    let nextVal;
    if (i === 0) nextVal = 0;
    else {
      nextVal = diff[0] - prev[0];
    }
    prev = [nextVal, ...diff];
    return prev;
  });
}

const r1 = historyDiffs.map(addToHistory)

const p1 = r1.map(diffs => {
  const diff = diffs[diffs.length - 1];
  return diff[diff.length - 1];
}).reduce((a,b) => a + b);

console.log(p1);

const rNeg1 = r1.map(subtractFromHistory);

const p2 = rNeg1.map(diffs => diffs[diffs.length - 1][0])
  .reduce((a,b) => a+b);

console.log(p2);