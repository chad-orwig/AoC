const _ = require('lodash');
const input = require('./input');
const moment = require('moment');

function addSleepTime(sleepTs, wakeTs) {
    const startMinute = sleepTs.minute(),
        endMinute = wakeTs.minute();
    this.sleepTime = this.sleepTime + endMinute - startMinute;
    const minuteTracker = this.minuteTracker;
    for(let i = startMinute; i < endMinute; i++) {
        minuteTracker[i] = (minuteTracker[i] || 0) + 1;
    }
}

function getSleepyMinute() {
    return _.chain(this.minuteTracker)
        .map((time, minute) => { return {time, minute, id : this.id}})
        .maxBy('time')
        .value();
}

function Guard(id) {
    this.id = id;
    this.sleepTime = 0;
    this.minuteTracker = {};
    this.addSleepTime = addSleepTime;
    this.getSleepyMinute = getSleepyMinute;
}

const guards = {};
const guardIdParser = /.*#(\d+).*/;

let currentGuard;
let sleepTs;

input.forEach(i => {
    if(i.s.includes('begins')) {
        if(sleepTs) {
            currentGuard.addSleepTime(sleepTs, i.ts);
            sleepTs = undefined;
        }
        const id = guardIdParser.exec(i.s)[1];
        guards[id] = guards[id] || new Guard(id);
        currentGuard = guards[id];
    }

    else if (i.s.includes('asleep')) {
        sleepTs = i.ts;
    }
    else if(i.s.includes('wakes')) {
        currentGuard.addSleepTime(sleepTs, i.ts);
        sleepTs = undefined;
    }

});

const sleepyGuard = _.maxBy(Object.values(guards), 'sleepTime');

const sleepyMinute = _.chain(sleepyGuard.minuteTracker)
    .map((time, minute) => { return {time, minute, id : sleepyGuard.id}})
    .maxBy('time')
    .value();



console.log(sleepyGuard.id * sleepyMinute.minute);

const sleepyMinutes = Object.values(guards).map((guard) => guard.getSleepyMinute());
const sleepyMinute2 = _.maxBy(sleepyMinutes, 'time');
console.log(sleepyMinute2.id * sleepyMinute2.minute);