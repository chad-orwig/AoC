import { input } from './input'

const banks = input.split('\n')
  .map((line) => line.split('').map(Number));

function maxIndex(acc: { index: number, val: number}, val: number, index: number) {
  if (val > acc.val) {
    return { index, val };
  }
  return acc;
}

const maxJoltage = (bank: number[], numDigits: number): string => {
  if(numDigits === 0) return '';
  const { index, val: digit } = bank.slice(0, bank.length - numDigits + 1).reduce(maxIndex, { index: 0, val: 0 });
  return `${digit}${maxJoltage(bank.slice(index + 1), numDigits - 1)}`;
}

const p1 = banks.map(bank => maxJoltage(bank, 2))
  .map(Number)
  .reduce((acc, curr) => acc + curr, 0);

console.log(p1);

const p2 = banks.map(bank => maxJoltage(bank, 12))
  .map(Number)
  .reduce((acc, curr) => acc + curr, 0);


console.log(p2);