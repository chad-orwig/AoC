const _ = require('lodash/fp');
const {input, test1, test2} = require('./input');

function sum(a,b){ return a + b }

function getDescendants(spaceObject) {
    return  spaceObject.children
        .map(getDescendants)
        .reduce(sum, spaceObject.children.length);
}

function SpaceObject(name) {
    this.name = name;
    this.children = [];
}

SpaceObject.prototype.addChild = function(childSpaceObject) {
    this.children.push(childSpaceObject);
    childSpaceObject.parent = this;
}

function nearestAnscestor(set, ancestor) {
    const childrenInSet = ancestor.children
        .filter(child => set.has(child));
    if(childrenInSet.length > 1) {
        return ancestor;
    }
    return nearestAnscestor(set, childrenInSet[0]);
}

function checkSetAndAdd(set, o) {
    if(set.has(o)) {
        return nearestAnscestor(set, o);
    }
    else {
        set.add(o);
    }
}

function findCommonAncestor(so1, so2) {
    const soSet = new Set([]);
    let commonAncestor = undefined;
    let a1 = so1;
    let a2 = so2;
    while(!commonAncestor) {
        if(a1) {
            commonAncestor = checkSetAndAdd(soSet, a1);
            a1 = a1.parent;
        }
        if(a2) {
            commonAncestor = checkSetAndAdd(soSet, a2);
            a2 = a2.parent;
        }
    }
    return commonAncestor;
}

const spaceOjbectsByName = {};

function countToAnscestor(start, ancestor) {
    let jumps = 0;
    let loc = start;
    while(loc !== ancestor) {
        jumps++;
        loc = loc.parent;
    }
    return jumps;
}

input.forEach(orbit => {
    const [parentName, childName] = orbit.split(')');

    const parent = spaceOjbectsByName[parentName] || new SpaceObject(parentName);
    spaceOjbectsByName[parentName] = parent;

    const child = spaceOjbectsByName[childName] || new SpaceObject(childName);
    spaceOjbectsByName[childName] = child;

    parent.addChild(child);
});

console.log(
    Object.values(spaceOjbectsByName)
        .map(getDescendants)
        .reduce(sum, 0));

const me = spaceOjbectsByName.YOU;
const santa = spaceOjbectsByName.SAN;

const start = me.parent;
const target = santa.parent;

const commonAncestor = findCommonAncestor(start, target);

console.log(commonAncestor.name);
console.log(countToAnscestor(start, commonAncestor) + countToAnscestor(target, commonAncestor));
