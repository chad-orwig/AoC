import { input,t } from './input.js';

const BOB = {
  '2': 2,
  '1': 1,
  '0': 0,
  '-': -1,
  '=': -2
}

function parseBob(l, i, arr) {
  let mult = arr.length - i - 1;

  let v = BOB[l];

  return Math.pow(5, mult) * v;
}

let sum = input.split('\n')
  .map(n => n.split('').map(parseBob).reduce((a,b) => a + b))
  .reduce((a,b) => a + b);


console.log(sum);

// console.log(sum /5/5/5/5/5/5/5/5/5/5/5/5/5/5/5/5/5/5/5)

console.log("2=1-=02-21===-21=200".split('').map(parseBob).reduce((a,b) => a + b))