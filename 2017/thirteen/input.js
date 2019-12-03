const input = "0: 3\n" +
    "1: 2\n" +
    "2: 4\n" +
    "4: 4\n" +
    "6: 5\n" +
    "8: 6\n" +
    "10: 6\n" +
    "12: 8\n" +
    "14: 6\n" +
    "16: 6\n" +
    "18: 8\n" +
    "20: 12\n" +
    "22: 8\n" +
    "24: 8\n" +
    "26: 9\n" +
    "28: 8\n" +
    "30: 8\n" +
    "32: 12\n" +
    "34: 20\n" +
    "36: 10\n" +
    "38: 12\n" +
    "40: 12\n" +
    "42: 10\n" +
    "44: 12\n" +
    "46: 12\n" +
    "48: 12\n" +
    "50: 12\n" +
    "52: 12\n" +
    "54: 14\n" +
    "56: 14\n" +
    "58: 12\n" +
    "62: 14\n" +
    "64: 14\n" +
    "66: 14\n" +
    "68: 14\n" +
    "70: 14\n" +
    "72: 14\n" +
    "74: 14\n" +
    "76: 14\n" +
    "78: 14\n" +
    "80: 18\n" +
    "82: 17\n" +
    "84: 14";

const testInput = "0: 3\n" +
    "1: 2\n" +
    "4: 4\n" +
    "6: 4";
const lines = input.split('\n');

function readLine(line) {
    const[depthString, rangeString] = line.split(': ');
    return {
        depth : Number(depthString),
        range : Number(rangeString)
    };
}

const objects = lines.map(readLine);
module.exports = objects;