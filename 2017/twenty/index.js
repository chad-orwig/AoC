const particles = require('./input');
const _ = require('lodash');

let min = manhattan(particles[0], 'a');
let ties = [0];
function manhattan(particle, prop) {
    const abs = particle[prop].map(Math.abs);
    return _.sum(abs);
}
function actualAccel(particle) {
    const squares = particle.a.map(val => val * val);
    const sum = _.sum(squares);
    return Math.sqrt(sum);
}
function largestAclDirection(particle) {
    const abs = particle.a.map(Math.abs);
    return Math.max(...abs);
}

function positionAt(particle, t) {
    const vt = particle.v.map(v => v * t);
    const atsquared = particle.a.map(a => a * (((t * t) + t) / 2));
    const x = particle.p[0] + vt[0] + atsquared[0];
    const y = particle.p[1] + vt[1] + atsquared[1];
    const z = particle.p[2] + vt[2] + atsquared[2];
    return [x,y,z];
}

function theLongWay(particle, t) {
    if(t === 0) {
        return manhattan(particle, 'p');
    }
    else {
        const v = [
            particle.v[0] + particle.a[0],
            particle.v[1] + particle.a[1],
            particle.v[2] + particle.a[2]
        ];
        const p = [
            v[0] + particle.p[0],
            v[1] + particle.p[1],
            v[2] + particle.p[2]
        ];
        const newParticle = {
            v,
            p,
            a : particle.a
        };
        return theLongWay(newParticle, t -1);
    }
}
for (let i = 1; i < particles.length; i++) {
    const test = manhattan(particles[i], 'a');
    if(test < min){
        min = test;
        ties = [i];
    }
    else if(test === min) {
        ties.push(i);
    }
}
console.log(ties);

let liveParticles = particles;

function removeCollisions(liveParticles, t) {
    const collisionMap = {};
    const positions = liveParticles.map(p => positionAt(p, t));
    _.forEach(positions, (p, i) => {
        const positionString = JSON.stringify(p);
        if(collisionMap[positionString] !== undefined) {
            liveParticles[collisionMap[positionString]].dead = true;
            liveParticles[i].dead = true;
        }
        else {
            collisionMap[positionString] = i;
        }
    });
    return _.filter(liveParticles, p => !p.dead);
}

for(let i = 0; i < 10000; i++) {
    liveParticles = removeCollisions(liveParticles, i);
}
console.log(liveParticles.length);
module.exports = {
    particles,
    theLongWay,
    positionAt,
    manhattan
};
