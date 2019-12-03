const input = require('./input');

const directionMap = {
    n : {
        q : 0,
        r : -1
    },
    ne : {
        q : 1,
        r : -1
    },
    se: {
        q : 1,
        r : 0
    },
    s : {
        q : 0,
        r : 1
    },
    sw : {
        q : -1,
        r : 1
    },
    nw : {
        q : -1,
        r : 0
    }
};

function traverse(q, r, direction) {
    const directionCalc = directionMap[direction];
    const resultQ = q + directionCalc.q;
    const resultR = r + directionCalc.r;
    return {
        q   : resultQ,
        r   : resultR
    };
};

let currentLocation = {
    q : 0,
    r : 0
};

function distanceFromHome(q, r) {
    if(q < 0) {
        if(r > 0) {
            return Math.max(Math.abs(q), Math.abs(r));
        }
        else {
            return Math.abs(q) + Math.abs(r);
        }
    }
    else {
        if(r > 0){
            return Math.max(Math.abs(q), Math.abs(r));
        }
        else {
            return Math.abs(q) + Math.abs(r);
        }
    }
}
let maxDistance = 0;
input.forEach((direction) => {
    currentLocation = traverse(currentLocation.q, currentLocation.r, direction);
    maxDistance = Math.max(maxDistance, distanceFromHome(currentLocation.q, currentLocation.r));
});

console.log(currentLocation);
console.log(maxDistance);