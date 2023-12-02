import { input as games } from './input.js'

const limits = {
  red: 12,
  green: 13,
  blue: 14,
};

const p1 = games.filter(g => g.isPossible(limits))
  .map((g) => g.id)
  .reduce((a,b) => a+b);

console.log(p1);

const p2 = games.map(g => g.fewestColors())
  .map(({ red, green, blue}) => red * green * blue)
  .reduce((a,b) => a + b);

console.log(p2);