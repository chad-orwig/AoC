import input, {test} from './input.js';

function part1(arr, val=2020) {
    if(arr.length === 1) return;
    const addend = arr[0];
    const slice = arr.slice(1);
    for(let i = 0; i < slice.length; i++) {
        const sum = slice[i] + addend;
        if(sum === val) {
            return slice[i] * addend;
        }
    }
    return part1(slice, val);
}

function part2(arr) {
    const addend = arr[0];
    const slice = arr.slice(1);
    const val = 2020 - addend;
    if(val < 0) return part2(slice);
    const ans = part1(slice, val);
    if(ans !== undefined) {
        return ans * addend;
    }
    return part2(slice);
}

console.log(part1(test));
console.log(part1(input));

console.log(part2(test));
console.log(part2(input));
