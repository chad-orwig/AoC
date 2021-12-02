import { input } from "./input.js";
const increasers = input.filter((val, i, arr) => val > arr?.[i - 1]);
console.log(increasers.length);

const pt2Increasers = input.filter((val, i, arr) => val > arr?.[i - 3]);
console.log(pt2Increasers.length);