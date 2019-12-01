const input = require('./input');
const _ = require('lodash');

function Constellation(startingPoint) {
    this.points = [startingPoint]
}

Constellation.prototype.canJoin = function(other) {
    for(let i = 0; i < other.points.length; i++) {
        for(let j = 0; j < this.points.length; j++) {
            if(manhattan(other.points[i], this.points[j]) <= 3) {
                return true;
            }
        }
    }
    return false;
}

Constellation.prototype.join = function(other) {
    this.points = [...this.points, ...other.points];
}

function manhattan(p1, p2) {
    const ans =
        Math.abs(p1[0] - p2[0]) +
        Math.abs(p1[1] - p2[1]) +
        Math.abs(p1[2] - p2[2]) +
        Math.abs(p1[3] - p2[3]);

    // console.log(ans);
    return ans;
}

let constellations = input.map(p => new Constellation(p));

let mergedConstellations = mergeConstellations(constellations);

while(constellations.length != mergedConstellations.length) {
    constellations = mergedConstellations;
    mergedConstellations = mergeConstellations(constellations);
    console.log(mergedConstellations.length);
}


function mergeConstellations(constellations) {
    let mergedConstellations = [];
    for(let i = 0; i < constellations.length; i++) {
        const thisConstellation = constellations[i]
        const toMerge = _.find(mergedConstellations, candidate => {
            return candidate.canJoin(thisConstellation);
        });
        if(toMerge) {
            toMerge.join(thisConstellation);
        }
        else {
            mergedConstellations.push(thisConstellation);
        }
    }
    return mergedConstellations;
}
