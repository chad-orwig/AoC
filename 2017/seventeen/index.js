const arr = [0];
let curPosition = 0;
const step = 335;
let count = 0;
let candidate;
for(let i = 1; i < 50000001; i++) {
    curPosition = ((curPosition + step) % i) + 1;
    if(curPosition === 1) {
        candidate = i;
    }
    count++;
    if(count === 100000) {
        count = 0;
        console.log(new Date());
    }
}

console.log(candidate);