const _ = require('lodash');
function stringToArray(s) {
    const split = s.split('/');
    return split.map(line => _.map(line, character => character));
}

function arrayToString(arr) {
    const arrayOfStrings = arr.map(innerArr => innerArr.join(''));
    return arrayOfStrings.join('/');
}

function rotate(arr) {
    const newArr = [];
    for(let col = 0; col < arr.length; col++) {
        const rowArr = [];
        for(let row=arr.length - 1; row >= 0; row--) {
            rowArr.push(arr[row][col]);
        }
        newArr.push(rowArr);
    }
    return newArr;

}

function flipH(arr) {
    const newArr = arr.map(innerArr => {
        const newInnerArr = [...innerArr];
        newInnerArr.reverse();
        return newInnerArr;
    });

    return newArr;
}

function flipV(arr) {
    const newArr = [...arr];
    newArr.reverse();

    return newArr;
}

function logArr(arr) {
    arr.forEach(row => console.log(row));
}

function slice2(arr) {
    const slices = [];
    for(let row=0; row < arr.length; row += 2) {
        for(let col = 0; col < arr.length; col += 2) {
            const row1 = arr[row].slice(col, col + 2);
            const row2 = arr[row + 1].slice(col, col + 2);
            slices.push([row1, row2]);
        }
    }
    return slices;
}

function slice3(arr) {
    const slices = [];
    for(let row=0; row < arr.length; row += 3) {
        for(let col = 0; col < arr.length; col += 3) {
            const row1 = arr[row].slice(col, col + 3);
            const row2 = arr[row + 1].slice(col, col + 3);
            const row3 = arr[row + 2].slice(col, col + 3);
            slices.push([row1, row2, row3]);
        }
    }
    return slices;
}

function slice(arr) {
    if(arr.length % 2 === 0) {
        return slice2(arr);
    }

    return slice3(arr);
}

function merge(slices) {
    const size = Math.sqrt(slices.length);
    const innerSize = slices[0].length;
    const arr = [];
    for(let i = 0; i < size; i++) {
        const sliceStart = start = i * size;
        const sliceEnd = start + size;
        for(let innerRow = 0; innerRow < innerSize; innerRow++) {
            const row = [];
            for(let sliceIndex = sliceStart; sliceIndex < sliceEnd; sliceIndex++) {
                const slice = slices[sliceIndex];
                row.push(...slice[innerRow]);
            }
            arr.push(row);
        }

    }

    return arr;
}

module.exports = {
    stringToArray,
    arrayToString,
    rotate,
    flipH,
    flipV,
    logArr,
    merge,
    slice
};