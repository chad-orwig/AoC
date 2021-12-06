import { input } from "./input.js";


const [numberString, ...boardStrings ] = input;
export const numbers = numberString.split(',').map(Number);

function BingoBoard(boardString) {
    this.rows = boardString.split('\n')
        .map(row => row.trim().split(/\s+/).map(Number));

    this.size = this.rows.length;
    this.markedRows = new Array(this.size).fill(0);
    this.markedCols = new Array(this.size).fill(0);
    this.markedNums = new Set();;
}

BingoBoard.prototype.hasNumber = function(num) {
    return this.rows.reduce((found, row, rowI) => found ?? 
        row.reduce((found, col, colI) => found ?? (col === num ? {rowI, colI} : null), null)
    , null)
}

BingoBoard.prototype.markNumber = function(num) {
    const loc = this.hasNumber(num);
    if(!loc) return false;

    this.markedNums.add(num);
    const rowCount = this.markedRows[loc.rowI] + 1;
    this.markedRows[loc.rowI] = rowCount;

    const colCount = this.markedCols[loc.colI] + 1;
    this.markedCols[loc.colI] = colCount;

    if(colCount === this.size || rowCount == this.size) return true;

}

BingoBoard.prototype.calcScore = function(num) {
    const [row0, ...remainingRows] = this.rows;
    const unmarkedSum = row0.concat(...remainingRows)
        .filter(num => !this.markedNums.has(num))
        .reduce((a,b) => a + b, 0);
    
        return unmarkedSum * num;
}

const boards = boardStrings.map(bs => new BingoBoard(bs));

function findWinner(boards, numbers, numberIndex) {
    const number = numbers[numberIndex];

    const winners = boards.filter(board => board.markNumber(number));
    if(winners.length){
        const winner = winners[0];
        const score = winner.calcScore(number);
        return {score, winner};
    }

    return findWinner(boards, numbers, numberIndex + 1);
}

const winner = findWinner(boards, numbers, 0);
console.log(winner);

function findLoser(boards, numbers, numberIndex) {
    const number = numbers[numberIndex];

    const losers = boards.filter(board => !board.markNumber(number));
    if(!losers.length){
        const loser = boards[0];
        const score = loser.calcScore(number);
        return {score, loser};
    }

    return findLoser(losers, numbers, numberIndex + 1);
}

const pt2Boards = boardStrings.map(str => new BingoBoard(str));

const {score, loser} = findLoser(pt2Boards, numbers, 0);
console.log(score);