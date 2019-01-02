function Group({units, hitPoints, weakness, immunities, attack, attackType, initiative }, army) {
    this.units = units;
    this.hitPoints = hitPoints;
    this.weakness = weakness || [];
    this.immunities = immunities || [];
    this.attack = attack;
    this.attackType = attackType;
    this.initiative = initiative;
    this.army = army;
}

Group.prototype.effectivePower = function() {
    this.ep = this.ep ||  (this.units * this.attack);
    return this.ep;
}

Group.prototype.isImmune = function(attackType) {
    return this.immunities.includes(attackType);
}

Group.prototype.isWeak = function(attackType) {
    return this.weakness.includes(attackType);
}

Group.prototype.takeDamage = function(damage) {
    const unitsLost = Math.min(Math.floor(damage / this.hitPoints), this.units);
    if(unitsLost) {
        this.units -= unitsLost
        delete this.ep;
        console.log(`${this.army} loses ${unitsLost} units`);
    }
}

module.exports = Group;