import {input, test} from './input.js';

const nums = input.map(s => ([...s]))
  .map(a => a.map(Number))
  .map(a => a.filter(n => !isNaN(n)));

const calibrationVals = nums.map(a => Number(a[0].toString() + a[a.length - 1]));

const p1 = calibrationVals.reduce((a,b) => a + b);

console.log(p1);

const digitMap = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const digitRegex = new RegExp(Object.keys(digitMap).join('|'), 'g');

function replaceDigits(s) {
  let ans = '';
  let index = 0;
  let res;
  while((res = digitRegex.exec(s)) !== null) {
    digitRegex.lastIndex -= res[0].length - 1; // This catches overlaps
    ans = ans + s.slice(index, digitRegex.lastIndex) + digitMap[res[0]];
    index = digitRegex.lastIndex;
  }
  ans = ans + s.slice(index);
  return ans;
}

const nums2 = input.map(replaceDigits)
  .map(s => ([...s]))
  .map(a => a.map(Number))
  .map(a => a.filter(n => !isNaN(n)));



const calibrationVals2 = nums2.map(a => Number(a[0].toString() + a[a.length - 1]));

const p2 = calibrationVals2.reduce((a,b) => a + b);

console.log(p2);
