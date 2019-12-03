const input = require('./input');
const Virus = require('./virus');

const virus = new Virus(input);

for(let i = 0; i < 10000000; i++) {
    virus.burst();
}

console.log(virus.infectCount);