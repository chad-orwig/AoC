import { input, testInput } from './input.js';


const crabs = input;
const sum = crabs.reduce((a,b) => a + b);
const mean = sum / crabs.length;
console.log(mean);
const distanceArray = [...new Array(Math.max(...crabs)).keys()]
    .map(v => crabs.map(c => Math.abs(v - c)).reduce((a,b) => a + b));

const closest = (array) => array.reduce((cV, v, i) => {
        if(!cV || cV.v > v) return { v, i };
        return cV;
    }, null);

console.log(closest(distanceArray));

const sumOfDistanceArray = [...new Array(Math.max(...crabs) + 1).keys()]
    .map(v => v * (v + 1) / 2);

const pt2Array = [...new Array(Math.max(...crabs)).keys()]
    .map(v => crabs.map(c => Math.abs(v - c)).map(v => sumOfDistanceArray[v]).reduce((a,b) => a + b))

console.log(closest(pt2Array));