const serialNumber = 9306;
const _ = require('lodash');
const moment = require('moment');
const start = moment();

function FuelCell(x, y) {
    this.x = x;
    this.y = y;
    this.rackId = x + 10;
    this.power = (Math.floor((((this.rackId * y) + serialNumber ) * this.rackId ) / 100) % 10) - 5;

}

function PowerCube(i, j, cells, size) {
    this.x = i + 1;
    this.y = j + 1;
    this.power = 0;
    this.size = size;
    for(let k = 0; k < size; k++) {
        for(let l = 0; l < size; l++) {
            this.power += cells[i+k][j+l].power;
        }
    }
}

const cells = _.range(300).map(() => []);

for(let i = 0; i < 300; i++) {
    const x = i+1;
    for(let j = 0; j < 300; j++) {
        const y = j + 1;
        cells[i][j] = new FuelCell(x, y);
    }
}

function bestCube(cells, size) {
    console.log(`Calculating best cube for size ${size}`);
    const effectiveSize = 300 - size + 1;
    const powerCubes = _.range(effectiveSize).map(() => []);
    for(let i = 0; i < effectiveSize; i++) {
        for(let j = 0; j < effectiveSize; j++) {
            powerCubes[i][j] = new PowerCube(i, j, cells, size);
        }
    }


    const ans = _.chain(powerCubes)
        .flatten()
        .maxBy('power')
        .value();

    return ans;
}

const bestCubes = [];
for(let i = 1; i <= 300; i++) {
    bestCubes.push(bestCube(cells, i));
}

console.log(_.maxBy(bestCubes, 'power'));
const end = moment();

console.log(end.diff(start, 'seconds'));
