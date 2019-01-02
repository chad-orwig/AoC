const Group = require('./Group');
const armyNames = {
    immuneSystem : 'Immune System',
    infection : 'Infection'
};
const immuneSystem =[
    { units: 2987, hitPoints: 5418,  immunities : ['slashing'], weakness : [ 'cold', 'bludgeoning'], attack: 17, attackType : 'cold', initiative: 5 },
    { units: 1980, hitPoints: 9978,  immunities : ['cold'], attack: 47, attackType : 'cold', initiative: 19 },
    { units: 648, hitPoints: 10733,  immunities : ['radiation', 'fire', 'slashing'], attack: 143, attackType : 'fire', initiative: 9 },
    { units: 949, hitPoints: 3117,  attack: 29, attackType : 'fire', initiative: 10 },
    { units: 5776, hitPoints: 5102,  weakness : [ 'cold'], immunities : ['slashing'], attack: 8, attackType : 'radiation', initiative: 15 },
    { units: 1265, hitPoints: 4218,  immunities : ['radiation'], attack: 24, attackType : 'radiation', initiative: 16 },
    { units: 3088, hitPoints: 10066,  weakness : [ 'slashing'], attack: 28, attackType : 'slashing', initiative: 1 },
    { units: 498, hitPoints: 1599,  immunities : ['bludgeoning'], weakness : [ 'radiation'], attack: 28, attackType : 'bludgeoning', initiative: 11 },
    { units: 3705, hitPoints: 10764,  attack: 23, attackType : 'cold', initiative: 7 },
    { units: 3431, hitPoints: 3666,  weakness : [ 'slashing'], immunities : ['bludgeoning'], attack: 8, attackType : 'bludgeoning', initiative: 8 }
].map(g => new Group(g, armyNames.immuneSystem));

const infection = [
    { units: 2835, hitPoints: 33751,  weakness : [ 'cold'], attack: 21, attackType : 'bludgeoning', initiative: 13 },
    { units: 4808, hitPoints: 32371,  weakness : [ 'radiation'], immunities : ['bludgeoning'], attack: 11, attackType : 'cold', initiative: 14 },
    { units: 659, hitPoints: 30577,  weakness : [ 'fire'], immunities : ['radiation'], attack: 88, attackType : 'slashing', initiative: 12 },
    { units: 5193, hitPoints: 40730,  immunities : ['radiation', 'fire', 'bludgeoning'], weakness : [ 'slashing'], attack: 14, attackType : 'cold', initiative: 20 },
    { units: 1209, hitPoints: 44700,  weakness : [ 'bludgeoning', 'radiation'], attack: 71, attackType : 'fire', initiative: 18 },
    { units: 6206, hitPoints: 51781,  immunities : ['cold'], attack: 13, attackType : 'fire', initiative: 4 },
    { units: 602, hitPoints: 22125,  weakness : [ 'radiation', 'bludgeoning'], attack: 73, attackType : 'cold', initiative: 3 },
    { units: 5519, hitPoints: 37123,  weakness : [ 'slashing', 'fire'], attack: 12, attackType : 'radiation', initiative: 2 },
    { units: 336, hitPoints: 23329,  weakness : [ 'fire'], immunities : ['cold', 'bludgeoning', 'radiation'], attack: 134, attackType : 'cold', initiative: 17 },
    { units: 2017, hitPoints: 50511,  immunities : ['bludgeoning'], attack: 42, attackType : 'fire', initiative: 6 }
].map(g => new Group(g, armyNames.infection));

const test = {
    is : [
        new Group({
            units: 17, 
            hitPoints: 5390, 
            weakness : ['radiation', 'bludgeoning'],
            attack   : 4507,
            attackType : 'fire',
            initiative : 2
        }, armyNames.immuneSystem),
        new Group({
            units : 989,
            hitPoints : 1274,
            immunities : ['fire'],
            weakness : ['bludgeoning', 'slashing'],
            attack : 25,
            attackType : 'slashing',
            initiative : 3
        }, armyNames.immuneSystem)
    ],
    inf : [
        new Group({
            units : 801,
            hitPoints : 4706,
            weakness : ['radiation'],
            attack : 116,
            attackType : 'bludgeoning',
            initiative : 1
        }, armyNames.infection),
        new Group({
            units : 4485,
            hitPoints : 2961,
            immunities : ['radiation'],
            weakness : ['fire', 'cold'],
            attack : 12,
            attackType : 'slashing',
            initiative : 4
        }, armyNames.infection)
    ]
};

module.exports = { immuneSystem, infection, armyNames };