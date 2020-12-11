import input from './input.js';

function CipherNumber(num) {
    this.num = num;
    this.list = [];
    this.addNumber = (number) => {
        this.list.push(number);
        while(this.list.length > 24) {
            this.list.shift();
        }
        if(this.list.length === 24) {
            this.set = new Set(this.list);
        }
    }
    this.hasMatch = (number) => !this.set || this.set.has(number - this.num);
}

const cipherNumbers = [];

let pt1Answers = [];
function addCipherNumber(number) {
    if(cipherNumbers.length === 25 && !checkValid(number)) {
        pt1Answers.push(number);
    }
    const cipherNumber = new CipherNumber(number);
    while(cipherNumbers.length > 24) {
        cipherNumbers.shift();
    }
    cipherNumbers.forEach(cn => {
        cn.addNumber(number);
        cipherNumber.addNumber(cn.num);
    })
    cipherNumbers.push(cipherNumber);
}

function checkValid(number) {
    return cipherNumbers.reduce((found, cn) => {
        return found || cn.hasMatch(number)
    }, false)
}
console.time()

input.forEach(addCipherNumber);
console.timeEnd();

console.log(pt1Answers);


const compareAgainst = (number) => (index, array) => array.slice(0, index)
    .reverse()
    .reduce((result, newNum, i) => {
        if(result.success !== undefined) return result;
        result.sum = result.sum + newNum;
        if(result.sum === number) {
            result.success = true;
            result.count = i + 1;
        }
        if(result.sum > number) result.success = false;
        return result;

    }, { sum: array[index], index});


const comparer = compareAgainst(pt1Answers[0]);

console.time();
const p2Answer = input
    .map((_, index, array) => comparer(index, array))
    .filter(result => result.success)[0];

console.log(p2Answer);

const nums = input.slice(p2Answer.index - p2Answer.count, p2Answer.index + 1);

const min = nums.reduce((a,b) => Math.min(a,b));
const max = nums.reduce((a,b) => Math.max(a,b));
console.log(min + max);
console.timeEnd();


