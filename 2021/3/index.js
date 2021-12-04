import { input } from "./input.js";
import utils from "../../utils.js";

/**
 * @typedef {Object} count
 * @property {number} ones
 * @property {number} zeros
 */
/**
 * @param {Array<count>} countArr 
 * @param {Array<string>} bits
 * @returns {Array<count>}
 */
function countBits(countArr, bits) {
    return bits.reduce((counts, bit, index) => {
        const oldCount = counts?.[index] ?? { ones: 0, zeros: 0 };
        /**
         * @type {count}
         */
        const newCount = {
            ones: oldCount.ones + (bit === '1' ? 1 : 0),
            zeros: oldCount.zeros + (bit === '0' ? 1 : 0)
        }
        return utils.replaceInArray(newCount, counts, index);

    }, countArr)
}

const counts = input.reduce((countArr, bits) => countBits(countArr, bits), []);

const buildCountReducer = (comparator) => (arr, val, i) => {
    arr[i] = comparator(val);
    return arr;
}

const gammaBinary = counts.reduce(buildCountReducer(({ ones, zeros }) => ones > zeros ? '1' : '0'), []);
const epsilonBinary = counts.reduce(buildCountReducer(({ ones, zeros }) => ones < zeros ? '1' : '0'), []);

const gamma = parseInt(gammaBinary.join(''), 2);
const epsilon = parseInt(epsilonBinary.join(''), 2);
console.log(gamma * epsilon);

const pt2Loop = (criteria) => { 
    const looper = (bitIndex, array, counts) => {
        if(array.length === 1 ) return array[0];
        const newArr = array.filter(criteria(bitIndex, counts));
        const newCounts = newArr.reduce((countArr, bits) => countBits(countArr, bits), []);
        return looper(bitIndex + 1, newArr, newCounts);
    }
    return looper;
}


const criteriaBuilder = (check) => (bitIndex, counts) => (bitArray) => {
    const count = counts[bitIndex];
    const valToKeep = check(count);
    return bitArray[bitIndex] === valToKeep;
}

const oxygenCheck = ({ ones, zeros }) => zeros > ones ? '0' : '1';
const co2Check = ({ ones, zeros }) => ones < zeros ? '1' : '0';

const oxygenCriteria = criteriaBuilder(oxygenCheck);
const co2Criteria = criteriaBuilder(co2Check);
const oxygenBinary = pt2Loop(oxygenCriteria)(0, input, counts);
const co2Binary = pt2Loop(co2Criteria)(0, input, counts);

const p2 = parseInt(oxygenBinary.join(''), 2) * parseInt(co2Binary.join(''), 2);

console.log(p2);



