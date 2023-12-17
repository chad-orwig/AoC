import { input } from './input.js';

const patterns = input.map(rows => new Pattern(rows));

/**
 * @class
 * @param {string[][]} rows 
 */
function Pattern(rows) {
  this.rows = rows;
  this.cols = rows[0].map((_,i) => rows.map(row => row[i]));
}

/**
 * 
 * @param {string[]} a1 
 * @param {string[]} a2 
 * @returns {boolean}
 */
function match(a1, a2) {
  return a1.every((s,i) => s === a2[i]);
}

/**
 * 
 * @param {Pattern} pattern 
 */
function horiReflect(pattern) {
  const ans = pattern.rows.reduce((v, n, i) => {
    if (!v.length) return v;
    const above = pattern.rows.slice(0,i).reverse();
    const below = pattern.rows.slice(i);
    const allMatch = above.every((r1, j) => {
      const r2 = below[j];
      return r2 === undefined || match(r1, r2);
    });
    if (allMatch) return i;
    return n;
  });

  if (ans.length) return -1;
  return ans;
}

/**
 * 
 * @param {Pattern} pattern
 */
function vertReflect(pattern) {
  const ans = pattern.cols.reduce((v, n, i) => {
    if (!v.length) return v;
    const left = pattern.cols.slice(0,i).reverse();
    const right = pattern.cols.slice(i);
    const allMatch = left.every((c1, j) => {
      const c2 = right[j];
      return c2 === undefined || match(c1, c2);
    });
    if (allMatch) return i;
    return n;
  });

  if (ans.length) return -1;
  return ans;
}

const p1 = patterns.map(pattern => [horiReflect(pattern), vertReflect(pattern)])
  .flatMap(([h,v]) => [v, 100 * h])
  .filter(val => val > 0)
  .reduce((a,b) => a + b);
console.log(p1);

/**
 * 
 * @param {string[]} a1 
 * @param {string[]} a2 
 * @returns {number}
 */
function missCount(a1, a2) {
  return a1.filter((s, i) => s !== a2[i]).length
}

/**
 * 
 * @param {Pattern} pattern 
 */
function horiNearReflect(pattern) {
  const ans = pattern.rows.reduce((v, n, i) => {
    if (!v.length) return v;
    const above = pattern.rows.slice(0,i).reverse();
    const below = pattern.rows.slice(i);
    const nearMatch = above.slice(0, below.length).map((r1, j) => [r1, below[j]])
      .map(([r1, r2]) => missCount(r1, r2))
      .reduce((a,b) => a + b, 0);
    if (nearMatch === 1) return i;
    return n;
  });

  if (ans.length) return -1;
  return ans;
}

/**
 * 
 * @param {Pattern} pattern
 */
function vertNearReflect(pattern) {
  const ans = pattern.cols.reduce((v, n, i) => {
    if (!v.length) return v;
    const left = pattern.cols.slice(0,i).reverse();
    const right = pattern.cols.slice(i);
    const nearMatch = left.slice(0, right.length).map((c1, j) => [c1, right[j]])
      .map(([c1, c2]) => missCount(c1, c2))
      .reduce((a,b) => a + b, 0);
    if (nearMatch === 1) return i;
    return n;
  });

  if (ans.length) return -1;
  return ans;
}

const p2 = patterns.map(pattern => [horiNearReflect(pattern), vertNearReflect(pattern)])
  .flatMap(([h,v]) => [v, 100 * h])
  .filter(val => val > 0)
  .reduce((a,b) => a + b);
console.log(p2);