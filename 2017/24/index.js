const magnents = require('./input');
const _ = require('lodash');

function matchesPort(port, magnents) {
    return _.filter(magnents, m => m.matchesPort(port));
}

function bridgeStrength(bridge) {
    return _.chain(bridge)
        .flatMap('ports')
        .sum()
        .value();
}

function longestAndStrongest(current, magnents) {
    const matches = matchesPort(current.nextPort, magnents);
    if(!matches.length) {
        return {
            strength : bridgeStrength(current),
            length   : current.length
        };
    }

    let maxLength = 0;
    let maxStrength = 0;
    matches.forEach(match => {
       const nextBridge = [...current, match];
       nextBridge.nextPort = match.getOtherPort(current.nextPort);
       const nextMagnents = _.without(magnents, match);
       const {strength, length} = longestAndStrongest(nextBridge, nextMagnents);
       if(length > maxLength) {
           maxLength = length;
           maxStrength = strength;
       }
       else if(length === maxLength && strength > maxStrength) {
           maxLength = length;
           maxStrength = strength;
       }
    });

    return {
        length : maxLength,
        strength : maxStrength
    };
}

const bridge = [];
bridge.nextPort = 0;

console.log(longestAndStrongest(bridge, magnents));