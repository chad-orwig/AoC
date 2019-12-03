const md5 = require('md5');
const input = 'wtnhxymk';


let ans = "- - - - - - - -".split(' ');
let index = 0;

while(!answerComplete()) {
    const check = md5(input + index);
    if(check.startsWith("00000")) {
        const loc = check.charAt(5);
        if(loc < 8 && ans[loc] === '-') {
            ans[loc] = check.charAt(6);
            console.log(ans.join(''));
        }
    }
    index ++;
}

function answerComplete() {
    for(let i = 0; i < 8; i++) {
        if(ans[i] === '-') {
            return false;
        }
    }

    return true;
}