const input = '1,20,11,6,12,0'
    .split(',')
    .map(Number);

console.log(input);

const map = new Map();
const seenTwice = new Map();
let prev = 0;
console.time();
for(let i = 0; i < 30000000; i++) {
    if(i < input.length) {
        prev = input[i];
    }
    else if(seenTwice.has(prev)) {
        prev = i - seenTwice.get(prev) - 1;
    }
    else {
        prev = 0;
    }
    if(map.has(prev)) {
        seenTwice.set(prev, map.get(prev));
    }
    map.set(prev, i);
}

console.log(prev);
console.timeEnd();