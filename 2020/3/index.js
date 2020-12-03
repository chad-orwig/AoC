import { testInput, mainInput } from './input.js';

function countTrees(input, x, y, currentX=0, currentY=0) {
    const newX = (currentX + x) % input[0].length;
    const newY = currentY + y;
    if(newY >= input.length) return 0;

    const val = input[newY][newX] === '#' ? 1 : 0;

    return val + countTrees(input, x, y, newX, newY);
}

console.log(countTrees(testInput, 3, 1));
console.log(countTrees(mainInput, 3, 1));

const slopes = [
    [1,1],
    [3,1],
    [5,1],
    [7,1],
    [1,2]
];

const ans = slopes
    .map(([x,y]) => countTrees(mainInput, x, y))
    .reduce((v, c) => v * c, 1);

console.log(ans);