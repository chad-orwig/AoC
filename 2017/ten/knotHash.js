let currentPosition;
let skipSize;
let list;
const knotHashPrepare = require('./knotHashPrepare');

function reverseItems(itemsToReverse) {
    const newArray = [...itemsToReverse];
    newArray.reverse();
    return newArray;
}

function reverse(list, curr, length) {
    const end = curr + length;
    const tailSlice = list.slice(curr, Math.min(end, list.length));
    const headSlice = (end > list.length) ? list.slice(0, end % list.length) : [];
    const middleSlice = list.slice(headSlice.length, curr);
    const postTailSlice = (end > list.length) ? [] : list.slice(end);

    const itemsToReverse = [...tailSlice, ...headSlice];
    const reversedItems = reverseItems(itemsToReverse);

    const newList = [...reversedItems.slice(reversedItems.length - headSlice.length), ...middleSlice, ...reversedItems.slice(0, reversedItems.length - headSlice.length), ...postTailSlice];
    return newList;
}

function round(lengths) {
    lengths.forEach((length) => {
        list = reverse(list, currentPosition, length);
        currentPosition += (length + skipSize);
        currentPosition = currentPosition % list.length;
        skipSize ++;
    });
}

function xorChain(arr) {
    let xor = arr[0];
    for(let i = 1; i < arr.length; i++) {
        xor = xor ^ arr[i];
    }
    return xor;
}

function dense(sparse) {
    const slices = [];
    for(let i = 0; i < 16; i++) {
        const start = i * 16;
        const end = start + 16;
        slices.push(sparse.slice(start, end));
    }
    return slices.map(xorChain);
}

function hexBuild(num) {
    const string = num.toString(16);
    const paddedString = string.length < 2 ? '0' + string : string;
    return paddedString;
}

function knotHash(input) {
    const lengths = knotHashPrepare(input);
    currentPosition = 0;
    skipSize = 0;
    list = [];

    for (let i = 0; i < 256; i++) {
        list.push(i);
    }

    for(let i = 0; i < 64; i++) {
        round(lengths);
    }
    const denseArray = dense(list);

    const hexArr = denseArray.map(hexBuild);
    const hex = hexArr.join('');
    return hex;
}

module.exports = knotHash;