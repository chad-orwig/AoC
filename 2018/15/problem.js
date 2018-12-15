const _ = require('lodash');
const input = require('./input');
const bfs = require('../../bfs');

const unitTypes = {
    goblin : 'G',
    elf    : 'E',
    open   : '.',
    wall   : '#'
};

function Unit(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.hp = 200;
    this.power = 3;
}

Unit.prototype.printLoc = printLoc;
Unit.prototype.findNearbyEnemy = findNearbyEnemy;
Unit.prototype.preformAttack = preformAttack;
Unit.prototype.attack = attack;
Unit.prototype.takeAction = takeAction;

let map;
let elves;
let goblins;
let livingGoblins;
let livingElves;

function init(elfPower) {
    map = {};
    elves = [];
    goblins = [];
    _.forEach(input.split('\n').map(s => s.split('')), (row, y) => {
        _.forEach(row, (type, x) => {
            const unit = new Unit(x, y, type);
            map[unit.printLoc()] = unit;
            if(unit.type === unitTypes.goblin) {
                goblins.push(unit);
            }
            if(unit.type === unitTypes.elf) {
                elves.push(unit);
            }
        });
    });

    elves.forEach(elf => elf.power = elfPower);

    livingGoblins = new Set(goblins);
    livingElves = new Set(elves);
}


function printLoc() {
    return `${this.x},${this.y}`;
}


function distanceFromCreator(destination) {
    return source => {
        return Math.abs(destination.x - source.x) + Math.abs(destination.y - source.y);
    }
}

function preformAttack() {
    const nearbyEnemies = this.findNearbyEnemy();

    if(nearbyEnemies.length) {
        const target = nearbyEnemies[0];
        target.attack(this.power);
        return true;
    }
}

function takeAction() {
    if(this.dead) {
        return;
    }

    if(!this.preformAttack()) {
        const enemies = this.type === unitTypes.elf ? Array.from(livingGoblins) : Array.from(livingElves);

        const potentialLocations = _.flatMap(enemies, findNearbyOpen);

        const distanceCalculators = potentialLocations.map(distanceFromCreator);

        const heuristic = (loc) => _.min(distanceCalculators.map(calc => calc(loc)));

        const bfsResult = bfs(this, findNearbyOpen, heuristic);

        if(bfsResult && bfsResult.length) {
            const dest = stepToTake(bfsResult, this);
            map[this.printLoc()] = new Unit(this.x, this.y, unitTypes.open);
            this.x = dest.x;
            this.y = dest.y;
            map[this.printLoc()] = this;

            this.preformAttack();
        }
    }
}

function getY(bfsResult) {
    return bfsResult.state.y;
}

function getX(bfsResult) {
    return bfsResult.state.x;
}

function stepToTake(bfsResult, start) {
    let current = _.orderBy(bfsResult, [getY, getX], ['asc', 'asc'])[0];

    while(current.prev.state !== start) {
        current = current.prev;
    }

    return current.state;
}

function attack(power) {
    this.hp -= power;
    if(this.hp <= 0) {
        this.dead = true;
        map[this.printLoc()] = new Unit(this.x, this.y, unitTypes.open);
        const living = this.type === unitTypes.elf ? livingElves : livingGoblins;

        living.delete(this);
    }
}

function findNearbyEnemy() {
    const enemies =  this.type === unitTypes.elf ? findNearbyOfType(this, unitTypes.goblin) : findNearbyOfType(this, unitTypes.elf);
    return _.orderBy(enemies, ['hp', 'y', 'x'], ['asc', 'asc', 'asc']);
}

function findNearbyOpen(me) {
    return findNearbyOfType(me, unitTypes.open);
}

function findNearbyOfType(me, type) {
    return _.filter(findNearbyInOrder(me), {type});
}

function findNearbyInOrder(me) {
    const up = map[`${me.x},${me.y - 1}`];
    const left = map[`${me.x - 1},${me.y}`];
    const right = map[`${me.x + 1},${me.y}`];
    const down = map[`${me.x},${me.y + 1}`];

    return [up, left, right, down];
}

function hpSum(set) {
    let sum = 0;
    set.forEach(u => sum+= u.hp);
    return sum;
}


let maxFail = 3;
let minSuccess = 200;

while(minSuccess - maxFail > 1) {
    let nextTry = maxFail + Math.floor((minSuccess - maxFail) / 2);
    console.log(`Trying ${nextTry}`);
    if(meetsCriteria(nextTry)) {
        console.log(`${nextTry} -- success`);
        minSuccess = nextTry;
    }
    else {
        console.log(`${nextTry} -- fail`);
        maxFail = nextTry;
    }
}

console.log(meetsCriteria(minSuccess, true));

function meetsCriteria(elfPower, log) {
    init(elfPower);
    const initalElfSize = elves.length;
    let rounds = 0;
    while(true) {
        const units = _.orderBy([...Array.from(livingGoblins), ...Array.from(livingElves)], ['y', 'x'], ['asc', 'asc']);

        for(let i = 0; i < units.length; i++) {
            const u = units[i];
            const opponents = u.type === unitTypes.elf ? livingGoblins : livingElves;
            const allies = u.type === unitTypes.goblin ? livingGoblins : livingElves;
            if(!opponents.size) {
                const sum = hpSum(allies);
                if(log) {
                    console.log(printMap());
                    console.log(`Elf Power: ${elfPower}`);
                    console.log(`Winning side: ${u.type}`);
                    console.log(`Rounds: ${rounds}`);
                    console.log(`HP Sum: ${sum}`);
                    console.log(rounds * sum);
                }
                if(u.type === unitTypes.elf && livingElves.size === initalElfSize){
                    return rounds * sum;
                }
                else {
                    return false;
                }

            }

            u.takeAction();

        }
        rounds ++;

        // console.log(`Elves HP: ${hpSum(livingElves)}`);
        // console.log(`Goblins HP: ${hpSum(livingGoblins)}`);
        // console.log(printMap());
    }
}


function printMap() {
    const rows = [];

    Object.values(map).forEach(u => {
        const row = rows[u.y] || [];
        rows[u.y] = row;

        row[u.x] = u.type;
    });

    return rows.map(row => row.join('')).join('\n');
}
