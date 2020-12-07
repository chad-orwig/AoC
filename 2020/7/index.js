import input from './input.js';

const parsed = input.map(rule => {
    const [_, type, r] = /^([\w\s]+) bags contain (.*)\./.exec(rule);
    return { 
        type,
        rules: r.split(', ')
            .filter(str => str !== 'no other bags')
            .map(rule => {
                const res = /^(\d+) ([\w\s]+) bags?/.exec(rule);
                if(!res) console.log(rule);
                return res && {
                    count: Number(res[1]),
                    type: res[2]
                }
            })
    }
});

function canCary(options) {
    return ({type, rules}) => {
        return rules && rules.filter(({type}) => options.has(type)).length
    };
}

const options = new Set(['shiny gold']);
let size = -1;
while(size !== options.size) {
    size = options.size;
    parsed
        .filter(canCary(options))
        .map(({type}) => type)
        .forEach(type => options.add(type));
    console.log(options.size);
}

const required = [{ count: 1, type: 'shiny gold'}];
let count = 0;
const map = parsed.reduce((map, rule) => map.set(rule.type, rule), new Map());
console.log(map);

while (required.length){
    const {count: outerCount, type} = required.pop();
    const bag = map.get(type);
    bag.rules.forEach(({type, count:innerCount}) => {
        const mult = innerCount * outerCount;
        count += mult;
        required.push({type, count: mult})
    })
}

console.log(count);