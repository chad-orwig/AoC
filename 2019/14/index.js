const recipies = require('./input');
const keyBy = require('lodash/fp/keyBy');
const keyByOutputChem = keyBy('output.chem');
const lcm = require('compute-lcm');

const recipieMap = keyByOutputChem(recipies);

function determineRequiredOre(required, extras ={}) {
    if(required.size === 1 && required.has('ORE')) {
        return {
            requiredOre : required.get('ORE'),
            extras
        };
    }
    const newReqs = new Map();
    for(let [chem, amountRequired] of required) {
        if(chem === 'ORE') {
            newReqs.set('ORE', (newReqs.get('ORE') || 0) + amountRequired);
            continue;
        }
        const recipie = recipieMap[chem];
        const amountWeHave = extras[chem] || 0;
        delete extras[chem];
        const ammountWeNeed = amountRequired - amountWeHave;
        if(ammountWeNeed <= 0) {
            required[chem] = amountWeHave - amountRequired;
        }
        else {
            const numberOfRuns = Math.ceil(ammountWeNeed/recipie.output.qty);
            const amountToMake = numberOfRuns * recipie.output.qty;

            extras[chem] = (extras[chem] || 0) + amountToMake - ammountWeNeed;
            recipie.inputs.forEach(({qty:inQty, chem: inChem}) => {
                const newInQty = (newReqs.get(inChem) || 0) + (inQty * numberOfRuns);
                newReqs.set(inChem, newInQty);
            });
        }
    }
    return determineRequiredOre(newReqs, extras);
    
}

const requiredPart1 = new Map([['FUEL', 1]]);
const {requiredOre:requiredOrePart1} = determineRequiredOre(requiredPart1);
console.log(requiredOrePart1);

function findLCMOfPeriods(counter) {
    const periodMap = new Map();
    const numChems = Object.keys(recipieMap).length;
    let amountOfFuel = counter;
    while(periodMap.size < numChems) {
        const {extras} = determineRequiredOre(new Map([['FUEL', amountOfFuel]]));
        Object.keys(extras).forEach(chem => {
            if(extras[chem] === 0 && !periodMap.has(chem)) {
                periodMap.set(chem, amountOfFuel);
            }
        });
        amountOfFuel+= counter;
    }

    const periods = [];
    for(let period of periodMap.values()) {
        periods.push(period);
    }
    return lcmOfPeriods = lcm(...periods);
}

function extrasEmpty(extras) {
    return extras && Object.values(extras)
        .filter(i => i)
        .length === 0;
}

const trillion = 1000000000000;
let max = 82892753 / 16;
let min = max / 2;
console.log(determineRequiredOre(new Map([['FUEL', min]])).requiredOre);

while(max > (min + 1)) {
    const attempt = ((max - min) / 2) + min;
    const {requiredOre} = determineRequiredOre(new Map([['FUEL', attempt]]));
    if(requiredOre === trillion) {
        min = attempt;
        max = attempt;
    }
    else if(requiredOre < trillion) {
        min = attempt;
    }
    else {
        max = attempt;
    }
}

console.log(min);
console.log(max);

console.log(determineRequiredOre(new Map([['FUEL', Math.floor(min)]])).requiredOre);
console.log(determineRequiredOre(new Map([['FUEL', Math.floor(max)]])).requiredOre);