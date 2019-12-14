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
const {requiredOre:requiredOrePart1, extras} = determineRequiredOre(requiredPart1);
console.log(requiredOrePart1);

const periodMap = new Map();
let oreMade = 0;
const numChems = Object.keys(recipieMap).length;
let amountOfFuel = 1;
while(periodMap.size < numChems) {
    const {extras} = determineRequiredOre(new Map([['FUEL', amountOfFuel]]));
    Object.keys(extras).forEach(chem => {
        if(extras[chem] === 0 && !periodMap.has(chem)) {
            periodMap.set(chem, amountOfFuel);
        }
    });
    amountOfFuel++;
}

const periods = [];
for(let period of periodMap.values()) {
    periods.push(period);
}

const lcmOfPeriods = lcm(...periods);

console.log(lcmOfPeriods);

console.log(determineRequiredOre(new Map([['FUEL', lcmOfPeriods]])).extras);