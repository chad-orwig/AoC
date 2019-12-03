const _ = require('lodash');
const input = require('./problem4Input');

const valid = _.filter(input,validInput);

function validInput(item) {
    const topFive = _.chain(item.encryptedNameWithoutDashes)
        .groupBy()
        .map((arr, key)=>{
            return { count: arr.length, key};
        })
        .orderBy(['count', 'key'], ['desc', 'asc'])
        .map('key')
        .value()
        .slice(0,5)
        .join('');

    item.topFive = topFive;

    return item.topFive === item.checksum;

}
const sum = _.sumBy(valid, 'sector');
console.log(sum);
valid.forEach(item => {
    const decryptedName = decryptName(item);
    if(/north/.test(decryptedName)) {
        console.log(decryptedName);
        console.log(item.sector);
    }
});

function decryptName({encryptedName, sector}) {
    return _.map(encryptedName, letter => {
        return decryptLetter(letter, sector);
    }).join('');
}

function decryptLetter(letter, sector) {
    if(letter === '-') {
        return ' ';
    }
    let code = letter.charCodeAt(0);
    code = code - 97 + sector;
    code = code % 26;
    code = code + 97;
    const decryptedLetter = String.fromCharCode(code);
    return decryptedLetter;
}