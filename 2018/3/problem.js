const _ = require('lodash');
const claims = require('./input');
const fabric = [
];

let potentialMatches = [];

claims.forEach(claim => {
   for(let i = 0; i < claim.width; i++) {
       let potentialClaim = true;
       for(let j = 0; j < claim.height; j++) {
           const arr = fabric[i+claim.x] || [];
           arr[j+claim.y] = (arr[j+claim.y] || 0) + 1;
           if(arr[j+claim.y] !== 1) {
               potentialClaim = false;
           }
           fabric[i+claim.x] = arr;
       }
       if(potentialClaim) {
           potentialMatches.push(claim);
       }
   }
});

let sum = 0;

for(let i = 0; i < fabric.length; i++) {
    const arr = fabric[i] || [];
    for(let j = 0; j < arr.length; j++) {
        if(arr[j] > 1) {
            sum++;
        }
    }
}

console.log(sum);

potentialMatches.forEach(claim => {
    let potentialClaim = true;
    outer:
    for(let i = 0; i < claim.width; i++) {
        for(let j = 0; j < claim.height; j++) {
            if(fabric[i+claim.x][j+claim.y] !== 1) {
                potentialClaim = false;
                break outer;
            }
        }
    }
    if(potentialClaim) {
        console.log(claim.id);
        process.exit();
    }
});