const input = require('./input');
function calcFuel(mass) {
    return Math.max(Math.floor(mass/3) - 2, 0);
}

function calcAdditionalFuel(mass) {
    if(mass <= 0) {
        return 0;
    }
    const additionalFuel = calcFuel(mass);

    return additionalFuel + calcAdditionalFuel(additionalFuel);
}

function sum(a,b) {
    return a + b;
}

const testInput = [
    12,14,1969,100756
];


console.log(
    input
    .map(calcAdditionalFuel)
    .reduce(sum, 0));