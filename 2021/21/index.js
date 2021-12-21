import { input } from './input.js';
import utils from '../../utils.js';
const { Maps } = utils;

const [ p1, p2 ] = input
    .split('\n')
    .map(str => str.split(/\D+/)
        .filter((v) => v)
        .map(Number)
    )
    .map(([id, start]) => new Player(id, start));


function Player (id, start) {
    this.id = id;
    this.start = start;
    this.pos = start;
    this.score = 0;
}

Player.prototype.move = function(die) {
    this.pos += die;
    this.pos = this.pos % 10;
    if(this.pos === 0) this.pos = 10;
}

function bruteSquad(p1, p2, score) {
    let die = 1;
    let playerCounter = 0;
    let rolls = 0;
    while((p1.score < score && p2.score < score) && (playerCounter !== 6 || playerCounter !== 3)) {
        if(die === 101) die = 1;
        if(playerCounter === 6) playerCounter = 0;
        if(playerCounter < 3) p1.move(die)
        else p2.move(die);
        if(playerCounter === 2) p1.score += p1.pos;
        if(playerCounter === 5) p2.score += p2.pos;
        rolls++;
        die++;
        playerCounter++;
    }
    const winner = p1.score > p2.score ? p1 : p2;
    const loser = p1 === winner ? p2 : p1;
    return { winner, loser, rolls };
}

const pt1 = bruteSquad(p1, p2, 1000);

console.log(pt1.loser.score * pt1.rolls);

// 3 = 1 / 27
// 4 = 3 / 27
// 5 = 6 / 27
// 6 = 7 / 27
// 7 = 6 / 27
// 8 = 3 / 27
// 9 = 1 / 27

const numUniversesForRolls = [
    [3, 1],
    [4, 3],
    [5, 6],
    [6, 7],
    [7, 6],
    [8, 3],
    [9, 1],
];

function quantamGame(p1Start, p2Start) {
    /**
     * @typedef {Map<number, Map<number, Map<number,Map<number,number>>>>} UniverseMap
     * @type UniverseMap
     */
    let mapOfTheUniverses = new Map();
    let setter = Maps.mapCoordinateSetter(mapOfTheUniverses);
    setter([p1Start, p2Start, 0, 0], 1);
    const winnerCounts = { p1: 0, p2: 0};
    let p1Turn = true;
    while(mapOfTheUniverses.size > 0) {
        /**
         * @type UniverseMap
         */
        const newMapOfTheUniverses = new Map();
        setter = Maps.mapCoordinateSetter(newMapOfTheUniverses);
        const getter = Maps.mapCoordinateGetter(newMapOfTheUniverses);
        mapOfTheUniverses.forEach(
            (m2, p1Pos) => m2.forEach(
                (m3, p2Pos) => m3.forEach(
                    (m4, p1Score) => m4.forEach(
                        (count, p2Score) => {
                            numUniversesForRolls.forEach(([die, numRolls]) => {
                                const p1 = { pos: p1Pos, score: p1Score };
                                const p2 = { pos: p2Pos, score: p2Score };
                                const newCount = numRolls * count;
                                if(p1Turn) {
                                    Player.prototype.move.call(p1, die);
                                    p1.score += p1.pos;
                                }
                                else {
                                    Player.prototype.move.call(p2, die);
                                    p2.score += p2.pos;
                                }
                                if(p1.score > 20) winnerCounts.p1 += newCount;
                                else if(p2.score > 20) winnerCounts.p2 += newCount;
                                else {
                                    const key = [p1.pos, p2.pos, p1.score, p2.score]
                                    const curVal = getter(key) ?? 0;
                                    setter(key, curVal + newCount);
                                }
                            });
                        }
                    )
                )));
        mapOfTheUniverses = newMapOfTheUniverses;
        p1Turn = !p1Turn;
    }
    
    return winnerCounts;

}

console.log(quantamGame(p1.start, p2.start));