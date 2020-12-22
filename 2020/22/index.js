import LinkedList from 'linked-list';
import { player1, player2 } from './input.js';

function battle(player1, player2) {
    if(player1.size === 0) return player2;
    if(player2.size === 0) return player1;

    const top1 = player1.head;
    const top2 = player2.head;
    top1.detach();
    top2.detach();

    if(top1.val > top2.val) {
        player1.append(top1);
        player1.append(top2);
    }
    else {
        player2.append(top2);
        player2.append(top1);
    }

    return battle(player1, player2);
}

function calculateScore(card, index) {
    const cardScore = card.val * index;
    if(!card.prev) return cardScore;

    return cardScore + calculateScore(card.prev, index + 1);
}

function copyDeck(card, limit, deck = new LinkedList()) {
    if(limit && deck.size === limit) return deck;
    const newCard = new LinkedList.Item();
    newCard.val = card.val;
    deck.append(newCard);
    if(!card.next) return deck;
    return copyDeck(card.next, limit, deck);
}

function printDeck(card, arr = Array(card.list.size), index = 0) {
    arr[index] = card.val
    if(!card.next) return arr.join(',');
    return printDeck(card.next, arr, index + 1);
}

function recursiveBattle(player1, player2, seen = new Set()) {
    if(player1.size === 0) return player2;
    if(player2.size === 0) return player1;
    const roundId = printDeck(player1.head) + '|' + printDeck(player2.head);
    if(seen.has(roundId)) return player1;

    seen.add(roundId);
    const top1 = player1.head;
    const top2 = player2.head;
    top1.detach();
    top2.detach();

    let roundWinner;
    if(player1.size >= top1.val && player2.size >= top2.val) {
        // sub-game
        const p1Copy = copyDeck(player1.head, top1.val);
        const p2Copy = copyDeck(player2.head, top2.val);

        const subGameWinner = recursiveBattle(p1Copy, p2Copy);
        roundWinner = subGameWinner === p1Copy ? player1 : player2;
    }
    else {
        // winner selected normally
        roundWinner = top1.val > top2.val ? player1 : player2;
    }

    if(roundWinner === player1) {
        player1.append(top1);
        player1.append(top2);
    }
    else {
        player2.append(top2);
        player2.append(top1);
    }

    return recursiveBattle(player1, player2, seen);
    
}

const winner = battle(copyDeck(player1.head), copyDeck(player2.head));
const score = calculateScore(winner.tail, 1);

console.log(score);

console.time('Part 2');
const recursiveWinner = recursiveBattle(copyDeck(player1.head), copyDeck(player2.head));
console.timeEnd('Part 2');
console.log(calculateScore(recursiveWinner.tail, 1));
