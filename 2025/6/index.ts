import { input } from './input'

const data = input.split('\n')
  .map((line) => line.split(/\s+/g));


const operators = data.pop() as string[];
operators.pop();

const nums = data.map(line => line.map(Number));

let p1 = 0;

const addReducer = (a: number, b: number) => a + b;
const multReducer = (a: number, b: number) => a * b;

while(nums[0]?.length) {
  const col = nums.map(line => line.pop() as number);
  const operator = operators.pop() as string;
  p1 += operator === '+' ? col.reduce(addReducer) : col.reduce(multReducer);
}

console.log(p1);

const p2Data = input.split('\n')
  .map((line) => line.split(''));

const separatorCols = p2Data[0]?.reduce((acc: number[], _curr, i) => {
  if(p2Data.every(line => line[i] === ' ')) {
    acc.push(i);
  }
  return acc;
}, []) as number[];

let p2 = 0;
const operators2 = p2Data?.pop()?.filter((char) => char !== ' ') as string[];
const row1 = p2Data[0] as string[];
while(row1.length) {
  const nextSeparator = separatorCols?.pop();
  const numArray: number[] = [];
  while(row1.length > (nextSeparator ?? 0)) {
    const num = p2Data.map(line => line.pop() as string)
      .join('')
      .trim();
    if(num) numArray.push(Number(num));
  }
  p2 += operators2.pop() === "+" ? numArray.reduce(addReducer) : numArray.reduce(multReducer)
}

console.log(p2);
