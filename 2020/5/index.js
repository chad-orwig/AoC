import input from './input.js';
import _ from 'lodash';

function decodeBoardingPass(bpString) {
    const row = goofSearch(bpString.substring(0, 7));
    const column = goofSearch(bpString.substring(7), "L", "R");

    return {
        row, column,
        seatId : row * 8 + column
    };

}

function goofSearch(str, lower="F", upper="B") {
    const bits = [...str].map(character => {
        switch(character) {
            case lower: return "0";
            case upper: return "1";
            default: throw new Error(`Broken goof search character ${character}`);
        }
    });
    const binary = bits.join("");
    return parseInt(binary, 2);
}

const bps = input
    .map(decodeBoardingPass);

const highSeatId = bps
    .reduce((prevMax, curr) => prevMax.seatId > curr.seatId ? prevMax : curr);

console.log(highSeatId.seatId);

const mySeat = _.sortBy(bps, 'seatId')
    .reduce((ans, {seatId}, i, arr) => {
        if(ans) return ans;
        if(i && seatId - arr[i - 1].seatId === 2) return seatId - 1;
    }, undefined);

console.log(mySeat);