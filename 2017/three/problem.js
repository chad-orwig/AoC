const input = 312051;

function findCircle(input) {
    let sum = 1;
    let circle = 0;
    let count = 0;

    while(sum < input) {
        count += 8;
        sum += count;
        circle ++;
    }

    sum -= count;

    console.log({sum, count, circle});

}

findCircle(input);

//1802  558 128

//151

const ansMap = {};

ansMap['0,0'] = 1;

let col = 1;
let row = 0;

let lastNum = 1;
direction = 'r';

const directionMap = {
    r : 'u',
    u : 'l',
    l : 'd',
    d : 'r'
};

const directionChange = {
    r : {y:0, x:1},
    u : {y:1, x:0},
    l : {y:0, x:-1},
    d : {y:-1,x:0 }
};

function findSum(col, row, ansMap) {
    let sum = 0;
    for(let i = -1; i < 2; i++) {
        for(let j = -1; j < 2; j++) {
            //console.log(`${col + i},${row + j}`);
            const test = ansMap[`${col + i},${row + j}`]
            if(test) {
                sum += test;
            }

        }
    }

    return sum;
}

function travel(direction, ansMap, col, row) {
    const {x, y} = directionChange[direction];
    const colAttempt = col + x;
    const rowAttempt = row + y;
    if(!ansMap[`${colAttempt},${rowAttempt}`]) {
        return {
            col : colAttempt,
            row : rowAttempt,
            direction: direction
        };
    }
}

function findNextLoc(col, row, ansMap, direction) {
    debugger;
    const turnAttempt = directionMap[direction];
    const ans = travel(turnAttempt, ansMap, col, row);
    if(!ans) {
        return travel(direction, ansMap, col, row);
    }
    return ans;
}

while(lastNum < input) {
    lastNum = findSum(col, row, ansMap);
    ansMap[`${col},${row}`] = lastNum;

    const nextLoc = findNextLoc(col, row, ansMap, direction);
    if(!nextLoc) {
        throw 'woops';
    }
    col = nextLoc.col;
    row = nextLoc.row;
    direction = nextLoc.direction;
    console.log(lastNum);
}