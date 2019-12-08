const input = require('./input');
const test = "123456789012";
const minBy = require('lodash/fp/minBy');
const flow = require('lodash/fp/flow');
const map = require('lodash/fp/map');
const filter = require('lodash/fp/filter');
const flatMap = require('lodash/fp/filter');
const flattenDeep = require('lodash/fp/flattenDeep');
const property = require('lodash/fp/property');
const eq = require('lodash/fp/eq');
const identity = require('lodash/fp/identity');

const width = 25;
const height = 6;
const picture = input;

const pixelsPerLayer = width * height;

function readLayer(s, layerNum) {
    const layerStart = layerNum * pixelsPerLayer;
    const layerEnd = layerStart + pixelsPerLayer;
    const slice = s.substring(layerStart, layerEnd);
    let rows = [];
    for(let i = 0; i < height; i++) {
        const rowStart = i * width;
        const rowEnd = rowStart + width;
        const row = slice.substring(rowStart, rowEnd);
        rows.push(row.split('').map(Number));
    }
    return {
        layerNum,
        rows
    };
}

const layers = [];

for(let layerNum = 0; layerNum * pixelsPerLayer < picture.length; layerNum++) {
    layers.push(readLayer(picture, layerNum));
}

function numberOfDigit(digit) {
    return flow(
        property('rows'),
        flattenDeep,
        filter(eq(digit)),
        property('length')
    );
}

const numZeros = numberOfDigit(0);
const numOnes = numberOfDigit(1);
const numTwos = numberOfDigit(2);

const layerWithFewestZeroes = minBy(numZeros)(layers);

console.log(numOnes(layerWithFewestZeroes) * numTwos(layerWithFewestZeroes));

// Part Two

function mergeLayer(topLayer, bottomLayer) {
    const rows = topLayer.rows.map((row, i) => mergeRow(row, bottomLayer.rows[i]));

    return {
        rows
    };
}

function mergeRow(topRow, bottomRow) {
    return topRow.map((pixel, i) => mergePixel(pixel, bottomRow[i]));
}

function mergePixel(topPixel, bottomPixel) {
    return topPixel === 2 ? bottomPixel : topPixel;
}

function convertPixel(pixel) {
    switch (pixel) {
        case 0 : return ' ';
        case 1 : return '█';
        default: return pixel;
    }
}

function rowToString(row) {
    return row
        .map(convertPixel)
        .join('');
}

const mergedLayer = layers.slice(1).reduce(mergeLayer, layers[0]);


const rowStrings = mergedLayer.rows
    .map(rowToString);

console.log(rowStrings);