const {immuneSystem, infection} = require('./input');
const _ = require('lodash');

let is = immuneSystem,
    inf = infection;

while(is.length && inf.length) {
    fight(is, inf);
    is = _.filter(is, 'units');
    inf = _.filter(inf, 'units');

    console.log(`Immune System: ${units(is)}`);
    console.log(`Infection: ${units(inf)}`);
}

function units(army) {
    return _.sumBy(army, 'units');
}

function fight(immuneSystem, infection) {
    const targets = selectTargetsRound(immuneSystem, infection);
    attack(targets);
}

function attack(targets) {
    const grouped = _.groupBy(targets, getAttackerInitiative);
    _.forEach(grouped, (group, key) => group.initiative = Number(key));
    const ordered = _.orderBy(grouped, 'initiative', 'desc');
    _.forEach(ordered, doAttacks);
}

function doAttacks(targetArray) {
    const withDamage = targetArray.map(({attacker, target}) => {
        return {
            attacker,
            target,
            damage : checkDamage(attacker, target)
        };
    });
    withDamage.forEach(dealDamage);
}

function dealDamage({attacker, target, damage}) {
    target.takeDamage(damage);
}

function selectTargetsRound(immuneSystem, infection) {
    const isTargets = selectTargets(immuneSystem, infection);
    const infTargets = selectTargets(infection, immuneSystem);
    return [...isTargets, ...infTargets];
}

function selectTargets(attacker, defender) {
    const defenderSet = new Set(defender);
    const orderedAttackers = _.orderBy(attacker, [getEffectivePower, 'initiative'], ['desc', 'desc']);

    return orderedAttackers.map(attacker => {
        const damageChecker = createDamageChecker(attacker);
        const target = _.orderBy(Array.from(defenderSet), [damageChecker, getEffectivePower, 'initiative'], ['desc', 'desc', 'desc'])[0];
        if(target && checkDamage(attacker, target)) {
            defenderSet.delete(target);
            return { attacker, target };
        }
    }).filter(_.identity);
}

function checkDamage(attacker, defender) {
    if(defender.isImmune(attacker.attackType)) {
        return 0;
    }
    const base = attacker.effectivePower();

    if(defender.isWeak(attacker.attackType)) {
        return base * 2;
    }

    return base;
}

function createDamageChecker(attacker) {
    return (defender) => checkDamage(attacker, defender);
}

function getEffectivePower(group) {
    return group.effectivePower();
}

function getAttackerInitiative(target) {
    return target.attacker.initiative;
}