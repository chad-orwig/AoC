const input = require('./input');
const _ = require('lodash');

const pt1 = input.getInput();
compress(pt1);

function compress(arr) {
    let leadIndex = 0;
    while(leadIndex < arr.length - 1) {
        const lead = arr[leadIndex];
        const trail = arr[leadIndex + 1];
        if((lead !== trail) && (lead.toUpperCase() === trail.toUpperCase())) {
            arr.splice(leadIndex, 2);
            leadIndex = Math.max(0, leadIndex -1);
        }
        else {
            leadIndex++;
        }
    }
}

console.log(pt1.length);

let min = 99999999999;

for(let n = 0; n < 26; n++) {
    const lower = String.fromCharCode(97 + n);
    const upper = lower.toUpperCase();
    const unfiltered = input.getInput();
    const filtered = unfiltered.filter(letter => (letter !== lower) && (letter !== upper));
    compress(filtered);
    const length = filtered.length;
    min = Math.min(min, length);
}
console.log(min);