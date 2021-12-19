import { input } from "./input.js";

/**
 * @typedef {RegularNumber|Pair} SnailfishNumber
 * @typedef {{
 * num: number,
 * parent: Pair,
 * depth: number
 * }} RegularNumber
 * @typedef {{ 
 * x: SnailfishNumber,
 * y: SnailfishNumber,
 * parent: Pair?
 * depth: number
 * }} Pair
 */

/**
 * @constructor
 * @param { SnailfishNumber } x
 * @param { SnailfishNumber } y
 * @param { Pair? } parent
 */
function Pair( x, y, parent) {
    this.x = x;
    this.y = y;
    this.setParent(parent);
}
/**
 * @constructor
 * @param {number} num 
 * @param {Pair} parent 
 */

function RegularNumber(num, parent) {
    this.num = num;
    this.setParent(parent);
}
/**
 * 
 * @param {Pair?} parent 
 */
function setParent (parent) {
    this.parent = parent;
    this.depth = parent ? parent.depth + 1 : 0;
    if(this instanceof Pair) {
        this.x.setParent(this);
        this.y.setParent(this);
    }
}
Pair.prototype.shouldExplode = function() {
    if(this.depth === 4) {
        if(!(this.x instanceof RegularNumber && this.y instanceof RegularNumber))
            throw new Error(`Exploding pair ${this} does not consist of two RegularNumbers`);
        return true;
    }
    return false;
}
Pair.prototype.findWhereIAmY = function() {
    if(!this.parent) return null;
    if(this.parent.y === this) return this.parent;
    return this.parent.findWhereIAmY();
}
Pair.prototype.findWhereIAmX = function() {
    if(!this.parent) return null;
    if(this.parent.x === this) return this.parent;
    return this.parent.findWhereIAmX();
}
Pair.prototype.findRightmostRegularNumber = function() {
    if(this.y instanceof RegularNumber) return this.y;
    return this.y.findRightmostRegularNumber();
}

Pair.prototype.findLeftmostRegularNumber = function () {
    if(this.x instanceof RegularNumber) return this.x;
    return this.x.findLeftmostRegularNumber();
}

Pair.prototype.findLeftmostExploder = function() {
    if(this.shouldExplode()) return this;
    if(this.depth > 4) return null;
    const xExploder = this.x instanceof Pair && this.x.findLeftmostExploder();
    if(xExploder) return xExploder;
    return this.y instanceof Pair && this.y.findLeftmostExploder();
}

Pair.prototype.explode = function() {
    const yAncestor = this.findWhereIAmY();
    if(yAncestor) {
        const regularNumber = yAncestor.x instanceof Pair ? yAncestor.x.findRightmostRegularNumber() : yAncestor.x;
        regularNumber.num += this.x.num;

    }
    const xAncestor = this.findWhereIAmX();
    if(xAncestor) {
        const regularNumber = xAncestor.y instanceof Pair ? xAncestor.y.findLeftmostRegularNumber() : xAncestor.y;
        regularNumber.num += this.y.num;
    }
    const newNumber = new RegularNumber(0, this.parent);
    if(this.parent.x === this) this.parent.x = newNumber;
    if(this.parent.y === this) this.parent.y = newNumber;
}
/**
 * 
 * @returns {RegularNumber?}
 */
Pair.prototype.findLeftmostSplitter = function() {
    if(this.x instanceof RegularNumber) {
        if(this.x.shouldSplit()) return this.x;
        if(this.y instanceof RegularNumber) {
            if(this.y.shouldSplit()) return this.y;
            return null;
        }
        return this.y.findLeftmostSplitter();
    }
    const splitter = this.x.findLeftmostSplitter();
    if(splitter) return splitter;
    if(this.y instanceof RegularNumber) {
        if(this.y.shouldSplit()) return this.y;
        return null;
    }
    return this.y.findLeftmostSplitter();
}

Pair.prototype.magnitude = function() {
    return (this.x.magnitude() * 3) + (this.y.magnitude() * 2);
}

Pair.prototype.setParent = setParent;
RegularNumber.prototype.setParent = setParent;
RegularNumber.prototype.magnitude = function() {
    return this.num;
}
RegularNumber.prototype.shouldSplit = function() {
    return this.num > 9;
}
RegularNumber.prototype.split = function () {
    const seed = this.num / 2;
    const newLeft = new RegularNumber(Math.floor(seed));
    const newRight = new RegularNumber(Math.ceil(seed));
    const newPair = new Pair(newLeft, newRight, this.parent);
    newLeft.setParent(newPair);
    newRight.setParent(newPair);
    if(this.parent.x === this) this.parent.x = newPair;
    if(this.parent.y === this) this.parent.y = newPair;
}

/**
 * 
 * @param {Pair} p1 
 * @param {Pair} p2
 * @param {Pair?} parent
 * @returns {Pair}
 */
function add(p1, p2, parent) {
    const n = new Pair(p1, p2, parent);
    while(reduce(n));
    return n;
}

/**
 * 
 * @param {Pair} pair 
 */
function reduce(pair) {
    const exploder = pair.findLeftmostExploder();
    if(exploder) {
        exploder.explode();
        return exploder;
    }
    const splitter = pair.findLeftmostSplitter();
    if(splitter) {
        splitter.split();
        return splitter;
    }
}

/**
 * 
 * @param {string} str
 * @returns {{ num: SnailfishNumber, remaining: string }} 
 */
function readString(str) {
    if(!str.startsWith('['))
        return {
            num: new RegularNumber(Number(str.charAt(0))),
            remaining: str.slice(1)
        };
    return readPair(str.slice(1));
}
/**
 * 
 * @param {string} str
 * @returns {{ num: Pair, remaining: string }} 
 */
function readPair(str) {
    const {num: x, remaining: xRemaining } = readString(str);
    if(!xRemaining.startsWith(',')) throw new Error(`Expected ',' got '${xRemaining.charAt(0)}'`);
    const { num: y, remaining: yRemaining } = readString(xRemaining.slice(1));
    if(!yRemaining.startsWith(']')) throw new Error(`Expected ']' got '${yRemaining.charAt(0)}'`);

    const pair = new Pair(x, y);
    return { num: pair, remaining: yRemaining.slice(1)};
}

const sum = input.map(readString)
    .map(({num}) => num)
    .reduce((a,b) => add(a,b));

console.log(sum.magnitude());

const maxMag = input.flatMap((str, i) => {
    return input.filter((_v, k) => k !== i)
        .map(v => [readString(str).num, readString(v).num]);
})
.map(([n1, n2]) => add(n1, n2))
.map(n => n.magnitude())
.reduce((a,b) => Math.max(a,b));

console.log(maxMag);