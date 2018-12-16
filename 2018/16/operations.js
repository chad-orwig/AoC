
function init(registers) {
    Object.assign(registers, {addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtir, gtri, gtrr, eqir, eqri, eqrr});
    return registers;
}

function addr(a,b,c) {
    this[c] = this[a] + this[b];
}
function addi(a,b,c) {
    this[c] = this[a] + b;
}
function mulr(a,b,c) {
    this[c] = this[a] * this[b];
}
function muli(a,b,c) {
    this[c] = this[a] * b;
}
function banr(a,b,c) {
    this[c] = this[a] & this[b];
}
function bani(a,b,c) {
    this[c] = this[a] & b;
}
function borr(a,b,c) {
    this[c] = this[a] | this[b];
}
function bori(a,b,c) {
    this[c] = this[a] | b;
}
function setr(a,b,c) {
    this[c] = this[a];
}
function seti(a,b,c) {
    this[c] = a;
}
function gtir(a,b,c) {
    this[c] = a > this[b] ? 1 : 0;
}
function gtri(a,b,c) {
    this[c] = this[a] > b ? 1 : 0;
}
function gtrr(a,b,c) {
    this[c] = this[a] > this[b] ? 1 : 0;
}
function eqir(a,b,c) {
    this[c] = a === this[b] ? 1 : 0;
}
function eqri(a,b,c) {
    this[c] = this[a] === b ? 1 : 0;
}
function eqrr(a,b,c) {
    this[c] = this[a] === this[b] ? 1 : 0;
}

module.exports = init;