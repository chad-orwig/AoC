import { rules, msgs, pt2Rules } from './input.js';

const regex = new RegExp("^" + rules.get(0).regexStr + "$");

console.log(msgs.filter(str => regex.test(str)).length);

const pt2Regex = new RegExp("^" + pt2Rules.get(0).regexStr + "$");

console.log(msgs.filter(str => pt2Regex.test(str)).length);

console.log(pt2Regex);