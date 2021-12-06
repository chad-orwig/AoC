import { input, testInput } from './input.js';

const fish = input
    .split(',')
    .map(Number);


function simulateLanternFish(numDays) {
    let fishCounts = fish.filter(f => f < 7)
        .reduce((fishCounts, f) => {
            fishCounts[f]++;
            return fishCounts;
        }, new Array(7).fill(0));
    let delay2 = fish.filter(f => f === 8).length;
    let delay1 = fish.filter(f => f === 7).length;
    for(let day = 0; day < numDays; day++) {
        const dayOfTheWeek = day % 7;
        const numNewFish = fishCounts[dayOfTheWeek];
        fishCounts[dayOfTheWeek] += delay1;
        delay1 = delay2;
        delay2 = numNewFish;
    }
    return fishCounts.reduce((a,b) => a + b) + delay2 + delay1;
}

const pt1 = simulateLanternFish(80);
console.log(pt1);

const pt2 = simulateLanternFish(256);
console.log(pt2);