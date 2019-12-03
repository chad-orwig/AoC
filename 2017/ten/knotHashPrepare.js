function knotHashPrepare(input) {
    const charCodes = [];
    for(let i = 0; i < input.length; i++) {
        charCodes.push(input.charCodeAt(i));
    }
    return [...charCodes, 17, 31, 73, 47, 23];
}

module.exports = knotHashPrepare;