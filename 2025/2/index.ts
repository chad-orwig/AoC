import { input } from './input';

function calcLengths(minString: string, maxString: string) {
  const lengths = [];
  for (let i = minString.length; i <= maxString.length; i++) {
    lengths.push(i);
  }
  return lengths as [number, ...number[]];
}

// function numMirrors(length: number) {
//   return Math.pow(10, length - 1) * 9;
// }

// function numMirrorsLessThanOrEqualTo(length: number, max: number) {
//   return numMirrors(length) - (Number(new Array(length).fill('9').join('')) - max)
// }

// function numMirrorsGreaterThanOrEqualTo(length: number, min: number) {
//   const charArray = new Array(length).fill('0');
//   charArray[0] = '1';
//   return numMirrors(length) - (min - Number(charArray.join('')))
// }

// function numMirrorsForRange({lengths, min, max}: Range) {
//   if (lengths.length === 1) {
//     const length = lengths[0] / 2;
//     const mi
//     return numMirrorsGreaterThanOrEqualTo(length, min) - numMirrorsGreaterThanOrEqualTo(length, max) + 1;
//   }
//   else {
//     // if not one we know it's two from checking the input
//     const [smaller, larger] = lengths as [number, number];
//     return numMirrorsGreaterThanOrEqualTo(smaller, min) + numMirrorsLessThanOrEqualTo(larger, max);
//   }
// }



const ranges = input.split(',')
  .map(range => range.split('-') as [string, string])
  .map(([minString, maxString]) => ({
    minString,
    maxString,
    min: Number(minString),
    max: Number(maxString),
    lengths: calcLengths(minString, maxString)
  }));

type Range = typeof ranges[number];


const p1 = ranges.flatMap(({max, min}) => {
  const arr = Array(max - min + 1);
  for(let i = 0; i <= (max - min); i++) {
    arr[i] = i + min;
  }
  return arr;
})
.map(String)
.filter((str) => str.length % 2 === 0)
.map((str) => {
  const half = str.length / 2;
  const firstHalf = str.slice(0, half);
  const secondHalf = str.slice(half);
  return [firstHalf, secondHalf];
})
.filter(([firstHalf, secondHalf]) => firstHalf === secondHalf)
.map((halves) => Number(halves.join('')))
.reduce((acc, curr) => acc + curr, 0);

console.log(p1);

function isInvalid(id: string) {
  for (let chunkSize = 1; chunkSize <= Math.floor(id.length / 2); chunkSize++ ) {
    const chunks: string[] = [];
    for(let i = 0; i < id.length; i += chunkSize) {
      chunks.push(id.slice(i, i + chunkSize));
    }
    if (chunks.every((chunk) => chunk === chunks[0])) {
      return true;
    }
  }
}

const p2 = ranges.flatMap(({max, min}) => {
  const arr = Array(max - min + 1);
  for(let i = 0; i <= (max - min); i++) {
    arr[i] = i + min;
  }
  return arr;
})
.map(String)
.filter(isInvalid)
.map(Number)
.reduce((acc, curr) => acc + curr, 0);

console.log(p2);