const scoreBoard = '37'.split('').map(Number);
const end = '260321';
const _ = require('lodash');

let elf1 = 0,
    elf2 = 1;

function loop() {
    const newRecipies = scoreBoard[elf1] + scoreBoard[elf2];
    const recipieStrings = newRecipies.toString().split('');
    _.forEach(recipieStrings, (recipie, index, array) => {
        const secondPart = index ? array.join('') : recipie;
        const firstPart = scoreBoard.slice(scoreBoard.length - 5 + index).join('');
        const test = firstPart + secondPart;
        if(end === test) {
            console.log(scoreBoard.length - 5 + index);
            process.exit();
        }

    });
    scoreBoard.push(...recipieStrings.map(Number));
    elf1 += scoreBoard[elf1] + 1;
    elf1 %= scoreBoard.length;

    elf2 += scoreBoard[elf2] + 1;
    elf2 %= scoreBoard.length;
}

while (true) {
    loop();
}

