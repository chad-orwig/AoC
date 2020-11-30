const input = require('./input');
const intCode = require('../intCode');
const range = require('lodash/fp/range');
const {promisify} = require('util');
const sleep = promisify(setTimeout);
const sleepTime = 100;

const router = new Array(50);
const idleAddresses = new Set();
let nat = { x : 0, y : 0};
let lastY = null;

function initInput(address) {
    router[address] = new Set();;
    return inputGenerator(address);
}

let idleCount = 0;

function markIdle(address) {
    idleAddresses.add(address);
    if(idleAddresses.size === 50) {
        idleCount++;
        if(idleCount === 100) {
            idleCount = 0;
            router[0].add(nat);
            idleAddresses.delete(0);
            if(lastY === nat.y) {
                console.log(lastY);
            }
            lastY = nat.y;
        }
    }
    else {
        idleCount = 0;
    }
}

async function* inputGenerator(address) {
    yield address;
    while(true) {
        if(router[address].size === 0) {
            markIdle(address);
            await sleep(sleepTime);
            yield -1;
        }
        else {
            idleAddresses.delete(address);
            const values = router[address].values();
            for(let value of values) {
                router[address].delete(value);
                yield value.x;
                yield value.y;
            }
        }
    }
}

async function getOutput({computer,address}) {
    const dest = (await computer.next()).value;
    const x = (await computer.next()).value;
    const y = (await computer.next()).value;
    return {
        dest,
        x,
        y,
        computer,
        address
    };
}

async function run(computers) {
    const promises = computers.map(getOutput);
    let y255 = null;
    while(true) {
        const {dest, x, y, computer, address} = await Promise.race(promises);
        if(dest === 255) {
            if(!y255) console.log(y);
            y255 = true;
            nat = { x, y };
        }
        else {
            router[dest].add({x,y});
        }
        promises[address] = getOutput({computer, address});
    }
    
}

const computers = range(0, 50)
    .map(address => ({computer: intCode(input, initInput(address)), address}));


run(computers)