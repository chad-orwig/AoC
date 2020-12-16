import { rules, ticket, nearby, testRules, testNearby } from './input.js';
import utils from '../../utils.js';

const matchesRule = (field) => (rule) => 
    (rule.req1.min <= field && rule.req1.max >= field) ||
    (rule.req2.min <= field && rule.req2.max >= field);

const fieldIsValid = (rules) => (field) => rules.find(matchesRule(field)) !== undefined;

const invalidFields = (rules) => (ticket) => ticket.filter(utils.negate(fieldIsValid(rules)));

const errorRate = nearby
    .flatMap(invalidFields(rules))
    .reduce((a,b) => a + b);

console.log(errorRate);

// Part 2

const isValidTicket = (rules) => {
    const _invalidFields = invalidFields(rules);
    return (ticket) => _invalidFields(ticket).length === 0;
}

const potentialFieldPositions = (rule) => (ticket) => ticket
    .map((_, index) => index)
    .filter(index => matchesRule(ticket[index])(rule));


const count = (arr) => arr.reduce((map, value) => {
    const curr = map.get(value) || 0;
    map.set(value, curr + 1);
    return map;
}, new Map());

const validNearby = nearby
    .filter(isValidTicket(rules));

let ruleOptions = rules.reduce((o, rule) => {
    const counts = count(validNearby.flatMap(potentialFieldPositions(rule)));
    const possibilities = [...counts.entries()]
        .filter(([_, count]) => count === validNearby.length)
        .map(([index]) => index);
    o[rule.field] = possibilities;
    return o;
}, {});

const optionFound = (options) => options.length === 1;

const allOptionsFound = (ruleOptions) => Object.values(ruleOptions)
    .find(utils.negate(optionFound)) === undefined;

const withoutAny = (set) => (arr) => {
    return arr.filter(v => !set.has(v));
}
console.log(ruleOptions);

while(!allOptionsFound(ruleOptions)) {
    const foundOptions = new Set(Object.values(ruleOptions)
        .filter(optionFound)
        .flat());
    const withoutAnyAlreadyFound = withoutAny(foundOptions);
    ruleOptions = Object.entries(ruleOptions)
        .reduce((o, [field, options]) => {
            if(optionFound(options)) o[field] = options;
            else o[field] = withoutAnyAlreadyFound(options);
            return o;
        }, {});
}

console.log(ruleOptions);
const ans = Object.entries(ruleOptions)
    .filter(([key]) => key.startsWith('departure'))
    .flatMap(([_, arr]) => arr.flat())
    .map(index => ticket[index])
    .reduce((a,b) => a*b);

console.log(ans);