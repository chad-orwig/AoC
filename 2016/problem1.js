const input = "R4, R1, L2, R1, L1, L1, R1, L5, R1, R5, L2, R3, L3, L4, R4, R4, R3, L5, L1, R5, R3, L4, R1, R5, L1, R3, L2, R3, R1, L4, L1, R1, L1, L5, R1, L2, R2, L3, L5, R1, R5, L1, R188, L3, R2, R52, R5, L3, R79, L1, R5, R186, R2, R1, L3, L5, L2, R2, R4, R5, R5, L5, L4, R5, R3, L4, R4, L4, L4, R5, L4, L3, L1, L4, R1, R2, L5, R3, L4, R3, L3, L5, R1, R1, L3, R2, R1, R2, R2, L4, R5, R1, R3, R2, L2, L2, L1, R2, L1, L3, R5, R1, R4, R5, R2, R2, R4, R4, R1, L3, R4, L2, R2, R1, R3, L5, R5, R2, R5, L1, R2, R4, L1, R5, L3, L3, R1, L4, R2, L2, R1, L1, R4, R3, L2, L3, R3, L2, R1, L4, R5, L1, R5, L2, L1, L5, L2, L5, L2, L4, L2, R3";
const testInput = "R2, R2, R2";
let nsTotal = 0;
let ewTotal = 0;
let currentDirection = 'N';

const directionMap = {
    N : {
        R : 'E',
        L : 'W',
        go : (amount) => {
            nsTotal += amount;
        }
    },
    E : {
        R : 'S',
        L : 'N',
        go : (amount) => {
            ewTotal += amount;
        }
    },
    S : {
        R : 'W',
        L : 'E',
        go : (amount) => {
            nsTotal -= amount;
        }
    },
    W : {
        R : 'N',
        L : 'S',
        go : (amount) => {
            ewTotal -= amount;
        }
    }
};

locations = {'0,0': true};

const directions = input.split(', ');

function buildDirections(goFunc, amount) {
    const locations = [];
    for(let i = 0; i < amount; i++ ) {
        goFunc(1);
        locations.push(`${nsTotal},${ewTotal}`);
    }
    return locations;
}

directions.forEach(function(direction) {
    let turn, amount, oldLocation;
    try {
        turn = direction[0];
        amount = Number(direction.slice(1));
        oldLocation = `${nsTotal},${ewTotal}`;
        currentDirection = directionMap[currentDirection][turn];
        locationsHit = buildDirections(directionMap[currentDirection].go, amount);
        locationsHit.forEach(location => {
            if(locations[location]) {
                console.log(location);
                process.exit(0);
            }
            else {
                locations[location] = true;
            }
        });

    }
    catch(e) {
        console.log(direction);
        console.log(turn);
        console.log(amount);
        console.log(currentDirection);
        console.log(oldLocation);
        console.log(e);
        process.exit(1);
    }
});

console.log('no answer');

