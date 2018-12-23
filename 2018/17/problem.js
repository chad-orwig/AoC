const input = require('./input');
const _ = require('lodash');


function Scan(clayIndicators) {
    this.minx = 999999999;
    this.maxx = 0;
    this.miny = 999999999;
    this.maxy = 0;
    this.flowCheck = {};
    clayIndicators.forEach(indicator => {
        this.minx = Math.min(indicator.minx, this.minx,);
        this.maxx = Math.max(indicator.maxx, this.maxx);

        this.miny = Math.min(indicator.miny, this.miny);
        this.maxy = Math.max(indicator.maxy, this.maxy);
        for(let x = indicator.minx; x <= indicator.maxx; x++) {
            for(let y = indicator.miny; y <= indicator.maxy; y++) {
                this.set(x, y, indicator);
            }
        }
    });
}
Scan.prototype.set = function(x, y, o) {
    this[`${x},${y}`] = o;
};
Scan.prototype.get = function(x, y) {
    return this[`${x},${y}`];
};

Scan.prototype.fillLeft = function(x, y) {
    let offset = 1;
    while(true) {
        if(!this.get(x - offset, y + 1)) {
            return x - offset;
        }
        else if (this.get(x - offset, y)) {
            return;
        }

        this.set(x - offset, y, true);
        offset++;
    }
};
Scan.prototype.fillRight = function(x, y) {
    let offset = 1;
    while(true) {
        if(!this.get(x + offset, y + 1)) {
            return x + offset;
        }
        else if (this.get(x + offset, y)) {
            return;
        }

        this.set(x + offset, y, true);
        offset++;
    }
};

Scan.prototype.findLeft = function(x, y) {
    let offset = 1;
    while(true) {
        if(this.get(x - offset, y)) {
            return;
        }
        this.set(x - offset, y, false);
        this.minx = Math.min(x - offset, this.minx);
        if(!this.get(x - offset, y + 1)) {
            return x - offset;
        }
        offset++;
    }
};

Scan.prototype.findRight = function(x, y) {
    let offset = 1;
    while(true) {
        if(this.get(x + offset, y)) {
            return;
        }
        this.set(x + offset, y, false);
        this.maxx = Math.max(x + offset, this.maxx);
        if(!this.get(x + offset, y + 1)) {
            return x + offset;
        }
        offset++;
    }
};


Scan.prototype.findBottom = function(x, y) {
    if(this.get(x, y)) {
        return true;
    }
    if(this.flowCheck[`${x},${y}`]) {
        return false;
    }
    for(let test = y; test <= this.maxy; test++) {
        if(this.get(x, test)) {
            const left = this.findLeft(x, test -1);
            const right = this.findRight(x, test - 1);
            if(left === undefined && right === undefined) {
                // console.log(`Filling ${x}, ${test - 1}`);
                this.set(x, test - 1, true);
                this.fillLeft(x, test - 1);
                this.fillRight(x, test - 1);
                return this.findBottom(x, y);
            }
            let keepGoing;
            if(left !== undefined) {
                keepGoing = this.findBottom(left, test - 1);
            }
            if(right !== undefined) {
                keepGoing = keepGoing || this.findBottom(right, test - 1);
            }

            if(!keepGoing) {
                this.flowCheck[`${x},${y}`] = true;
                return false;
            }

            return this.findBottom(x, y);
        }
        else {
            this.set(x, test, false);
        }
    }
    this.flowCheck[`${x},${y}`] = true;
    return false;
};

Scan.prototype.print = function() {
    const rows = [];
    for(let x = this.minx; x <= this.maxx; x++) {
        for(let y = 0; y <= this.maxy; y++) {
            const row = rows[y] || [];
            rows[y] = row;
            const val = this.get(x, y);
            switch(val) {
                case true:
                    row[x - this.minx] = '~';
                    break;

                case false:
                    row[x - this.minx] = '|';
                    break;

                case undefined:
                    row[x - this.minx] = '.';
                    break;

                default:
                    row[x - this.minx] = '#';
                    break;
            }
        }
    }

    return rows.map(row => row.join('')).join('\n');
};

const scan = new Scan(input);

// const queue = scan.findBottom(500, 0);
// const seen = {};
// let seenCount = 0;
// while(queue.length) {
//
//     const {x, y, finderY} = queue.shift();
//     if(seen[`${x},${y}`]) {
//         if(!queue.length) {
//             queue.push(...(scan.findBottom(500, 0) || []));
//         }
//         seenCount++;
//
//         if(seenCount === 1000) {
//             break;
//         }
//         continue;
//     }
//
//     seenCount = 0;
//     seen[`${x},${y}`] = true;
//
//     console.log(`Filling At ${x},${y}`);
//     scan.set(x, y, true);
//     scan.fillLeft(x, y);
//     scan.fillRight(x, y);
//
//
//     const newStuff = y !== finderY ? scan.findBottom(x, finderY) : scan.findBottom(500, 0);
//     if(newStuff) {
//         queue.push(...newStuff);
//     }
//
// }
scan.findBottom(500, 1);


console.log(scan);
const result = _.chain(scan)
    .filter((item, key) =>{
        const keep = (item === true) || (item === false);
        if(keep) {
            const [x, y] = key.split(',');
            if(scan.minx > x || scan.maxx < x || scan.miny > y || scan.maxy < y) {
                console.error(key);
            }
        }
        return keep;
    })
    .map(() => 1)
    .sum()
    .value();

// console.log(scan.print());
console.log(result);
console.log('Actually was 39162');

const part2 = _.chain(scan)
    .filter(item => item === true)
    .map(() => 1)
    .sum()
    .value();

console.log(part2);