const input = "5 9 2 8\n" +
    "9 4 7 3\n" +
    "3 8 6 5";
const inputArray = input.split('\n');
const inputArrayArray = inputArray.map((row) => {
    const strings = row.split(' ');
    const nums = strings.map(Number);
    return nums.sort();
});

module.exports = inputArrayArray;