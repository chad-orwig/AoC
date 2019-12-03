const input = require('./input');

function rowDiff(row) {
    let min = row[0], max = row[0];
    for(let i = 1; i < row.length; i++) {
        min = Math.min(min, row[i]);
        max = Math.max(max, row[i]);
    }
    const diff = max - min;
    console.log(`max: ${max}; min: ${min}; diff: ${diff}`);
    return diff;
}

function checksum(table) {
    let sum = 0;
    table.forEach((row) => {
        sum += rowDiff(row);
    });
    console.log(sum);
}
function pt2Checksum(table) {
    let sum = 0;
    table.forEach(row => {
        const {dividend, divisor} = findDivisiable(row);
        sum += (dividend / divisor);
    });
    console.log(sum);

}
function findDivisiable(row) {
    let divisorIndex = 0;
    let dividendIndex = row.length - 1;
    let divisor = row[divisorIndex], dividend = row[dividendIndex];
    let quotient = dividend / divisor;
    console.log(`quotient: ${quotient}; dividend: ${dividend}; divisor: ${divisor}`);
    while(quotient != Math.floor(quotient)) {
        dividendIndex --;
        dividend = row[dividendIndex];
        if(dividend === divisor || dividend < divisor * 2) {
            divisorIndex++;
            divisor = row[divisorIndex];
            dividendIndex = row.length - 1;
            dividend = row[dividendIndex];
        }
        quotient = dividend / divisor;
        console.log(`quotient: ${quotient}; dividend: ${dividend}; divisor: ${divisor}`);
        debugger;

    }
    console.log('found');
    return {dividend, divisor}
}

//checksum(input);
pt2Checksum(input);