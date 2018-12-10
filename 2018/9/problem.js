const _ = require('lodash');
const moment = require('moment');
const List = require('linked-list');
const numMarbles = 7091801;
const numElves = 464;

function addToScore(marble) {
    this.score += marble;
}

function Elf() {
    this.score = 0;
    this.addToScore = addToScore;
}

function myNext() {
    return this.next || this.list.head;
}

function myPrev() {
    return this.prev || this.list.tail;
}

function newMarble(val) {
    const item = new List.Item();
    item.myVal = val;
    item.myNext = myNext;
    item.myPrev = myPrev;
    return item;
}

const elves = _.range(numElves).map(() => new Elf());
const list = new List(newMarble(0));
let currentMarble = list.head;
const start = moment();
for(let i = 1; i < numMarbles; i++) {
    const nextMarble = newMarble(i);
    if(i % 23) {
        currentMarble.myNext().append(nextMarble);
        currentMarble = nextMarble;
    }
    else {
        const elf = elves[i % numElves];
        elf.addToScore(i);
        const itemToRemove = currentMarble.myPrev().myPrev().myPrev().myPrev().myPrev().myPrev().myPrev();
        currentMarble = itemToRemove.myNext();
        itemToRemove.detach();
        elf.addToScore(itemToRemove.myVal);
    }
}

console.log(_.maxBy(elves, 'score'));
console.log(moment().diff(start));
