const md5 = require('md5');
const _ = require('lodash');
const salt = 'qzyelonm';
const interestingNumbers = {
    triples : [],
    cincos   : []
};

function findTriple(hash) {
    for(let i = 2; i < hash.length; i++) {
        const first = hash.charAt(i - 2);
        const second = hash.charAt(i - 1);
        const third = hash.charAt(i);
        if(first === second && second === third) {
            return first;
        }
    }
}

let furthestTraveled;
function findCincosForHash(hash, index) {
    const foundCincos = [];
    for(let i = 4; i < hash.length; i++) {
        const first = hash.charAt(i - 4);
        const second = hash.charAt(i - 3);
        const third = hash.charAt(i - 2);
        const fourth = hash.charAt(i - 1);
        const fifth = hash.charAt(i);
        if(first === second && second === third && third === fourth && fourth === fifth) {
            foundCincos.push({
                value : first,
                hash  : hash,
                index
            });
        }
    }
    return foundCincos;
}

function findCincos(index) {
    furthestTraveled = index;
    const hash = md5Stretch(salt + index);
    const triple = findTriple(hash);
    if(triple) {
        interestingNumbers.triples.push({
            value : triple,
            index
        });

        interestingNumbers.cincos.push(...findCincosForHash(hash, index));
    }
}

function confirmHash(triple, index) {
    const offset = index + 1;
    const passedCincos = [];

    for(let i = furthestTraveled + 1; i < offset + 1000; i++) {
        findCincos(i);
    }

    for(let i = 0; i < interestingNumbers.cincos.length; i++ ) {
        const cinco = interestingNumbers.cincos[i];
        if(cinco.index < offset) {
            passedCincos.push(cinco);
        }
        else if(cinco.value === triple){
            keysProduced++;
            const hash = md5(salt + index);
            console.log(`found key #${keysProduced} ${index} ${hash}`);
            if(keysProduced === 64) {
                process.exit();
            }
            return;
        }
    }

    interestingNumbers.cincos = _.without(interestingNumbers.cincos, passedCincos);
}

function md5Stretch(original) {
    let val = md5(original);
    // for (let i = 0;  i < 2016; i++) {
    //     val = md5(val);
    // }
    return val;
}

function investigate(offset) {
    furthestTraveled = offset;
    const hash = md5Stretch(salt + offset);
    const triple = findTriple(hash);
    if(triple) {
        confirmHash(triple, offset)
    }
}

let keysProduced = [];
investigate(0);
while(true) {
    if(interestingNumbers.triples.length) {
        const tripleData = interestingNumbers.triples[0];
        interestingNumbers.triples = interestingNumbers.triples.slice(1);
        confirmHash(tripleData.value, tripleData.index);
    }
    else {
        investigate(furthestTraveled + 1);
    }
}

// myResults.forEach(resultLine => {
//    const [tripleIndex, cincoIndex] = resultLine;
//    console.log(md5(salt + tripleIndex));
//    console.log(md5(salt + cincoIndex));
//    console.log();
// });