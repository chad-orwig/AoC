const lengths = require('./input');
const knotHash = require('./knotHash');
const hex = knotHash(lengths);
console.log(hex);