const input = require('./input');

const depthMap = {};

input.forEach(firewall => {
    depthMap[firewall.depth] = firewall;
});

function whereIsScanner({range}, ps) {
    let pos = ps % (range + range - 2);
    if(pos >= range){
        pos = range - 1 - (pos % range)
    }

    return pos;
}


function severity(firewall) {
    return firewall.depth * firewall.range;
}

function amISafe(delay) {
    let ps = 0;

    while(ps <= 84) {
        if(depthMap[ps] && whereIsScanner(depthMap[ps], ps + delay) === 0) {
            return false;
        }
        ps++;
    }

    return true;
}

let delay = 0;
while(!amISafe(delay)) {
    delay ++;
}

console.log(delay);