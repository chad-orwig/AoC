const _ = require('lodash');
const input = require('./problem8input');
const rectRegex = /rect (\d+)x(\d+)/;
const columnRegex = /rotate column x=(\d+) by (\d+)/;
const rowRegex = /rotate row y=(\d+) by (\d+)/;


const screen = initializeScreen(50, 6);

function rect(cols, rows) {
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < cols; c++) {
            screen[r][c] = true;
        }
    }
}

function rotateRow(rowNum, amount) {
    const row = screen[rowNum];
    const truncatedAmount = amount % screen.cols;
    const newRow = _.map(row, (item, index) => {
        const newTennantLoc = (index - truncatedAmount + screen.cols) % screen.cols;
        return row[newTennantLoc];

    });
    screen[rowNum] = newRow;

}

function rotateCol(colNumber, amount) {
    const col = _.map(screen, (row) => {
        return row[colNumber];
    });

    const truncatedAmount = amount % screen.rows;
    const newCol = _.map(col, (item, index) => {
        const newTennantLoc = (index - truncatedAmount + screen.rows) % screen.rows;
        return col[newTennantLoc];
    });

    _.forEach(newCol, (item, index) => {
        screen[index][colNumber] = item;
    })
}

function initializeScreen(cols, rows) {
    const screen = [];
    screen.cols = cols;
    screen.rows = rows;

    for(let r = 0; r < rows; r++) {
        const row = [];
        screen.push(row);
        for(let c= 0; c < cols; c++) {
            row[c] = false;
        }
    }
    return screen;
}

function readCommand(text) {
    const rectParams = rectRegex.exec(text);
    if(rectParams) {
        const params = rectParams.slice(1).map(Number);
        return {
            func : rect,
            params

        };
    }
    const columnCommands = columnRegex.exec(text);
    if(columnCommands) {
        const params = columnCommands.slice(1).map(Number);
        return {
            func : rotateCol,
            params
        };
    }
    const rowCommands = rowRegex.exec(text);
    if(rowCommands) {
        const params = rowCommands.slice(1).map(Number);
        return {
            func : rotateRow,
            params
        };
    }

    throw `Unable to parse command: ${text}`;
}

input.map(readCommand).forEach(({func, params}) => {
    func(...params);
});

screen.forEach(row => {
    console.log(row.map(item => {
        if(item) {
            return '0';
        }
        else {
            return ' ';
        }
    }).join(''));
});
const countsByRow = _.map(screen, row => _.filter(row).length);

const sum = _.sum(countsByRow);

console.log(sum);