import {input, test} from './input.js';

const cards = input;

function match(card) {
  const matches = card.have.filter(n => card.winners.includes(n)).length;
  return matches;
}

function score(matches) {
  if (matches === 0) return 0;
  return Math.pow(2, matches - 1);
}

const matches = cards.map(match);

const scores = matches.map(score);

const p1 = scores
  .reduce((a,b) => a+b);

console.log(p1);

const scoreCards = scores.map((score, index) => ({ ...cards[index], score, matches: matches[index] }));

const incrementCount = (arr, index, ammount) => {
  const oldAmmount = arr[index] ?? 0;
  const newAmmount = oldAmmount + ammount;
  arr[index] = newAmmount;
  return newAmmount;
}

const p2 = scoreCards.reduce((arr, card, index) => {
  const myCount = incrementCount(arr, index, 1);
  for(let i = 1; i <= card.matches; i++) {
    incrementCount(arr, index + i, myCount);
  }
  return arr;
}, [])
.reduce((a,b) => a + b);

console.log(p2);

