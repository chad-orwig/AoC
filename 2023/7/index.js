import { input, Hand } from './input.js';

const cardsInValueOrder = '23456789TJQKA'.split('');
let cardValues = Object.fromEntries(Object.entries(cardsInValueOrder).map(([r, c]) => ([c,r])));
/**
 * @typedef {import('./input.js').HandType} HandType
 * @type {{ [HandType]: number }}
 */
const typeValues = {
  'high card': 0,
  'one pair': 1,
  'two pair': 2,
  'three of a kind': 3,
  'full house': 4,
  'four of a kind': 5,
  'five of a kind': 6,
}

/**
 * @param {Hand} a 
 * @param {Hand} b 
 * @returns {number}
 */
function compareHands(a,b) {
  return typeValues[a.type] - typeValues[b.type] ||
    b.cards.map(c => cardValues[c])
      .map((c,i) => cardValues[a.cards[i]] - c)
      .filter(c => c !== 0)[0] || 0;
}

const hands = [...input];
hands.sort(compareHands);
const p1 = hands.map((h, i) => h.bid * (i + 1))
  .reduce((a,b) => a + b);
console.log(p1);

const p2ardsInValueOrder = 'J23456789TQKA'.split('');
cardValues = Object.fromEntries(Object.entries(p2ardsInValueOrder).map(([r, c]) => ([c,r])));

/**
 * @param {Hand} hand
 * @returns {HandType} 
 */
function calcTypeP2(hand) {
  const originalCounts = { J: 0, ...hand.counts};
  const {J, ...countsWithoutJ } = originalCounts;
  const blindCounts = Object.values(countsWithoutJ);
  const max = Math.max(0,...blindCounts);
  if (max + J === 5)
    return 'five of a kind';
  if (max + J === 4)
    return 'four of a kind';
  if (max + J === 3)
    return blindCounts.length === 2 ? 'full house' : 'three of a kind';
  if (blindCounts.length === 3) {
    return 'two pair';
  }
  if (blindCounts.length === 4)
    return 'one pair';
  return 'high card';
}

const p2Hands = hands.map((h) => ({ ...h, type: calcTypeP2(h) }));


p2Hands.sort(compareHands);
const p2 = p2Hands.map((h, i) => h.bid * (i + 1))
  .reduce((a,b) => a + b);
console.log(p2)