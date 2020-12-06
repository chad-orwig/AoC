import groups from './input.js';

const sum1 = groups
    .map(group => group.replace(/\s/g, ""))
    .map(group => [...group].reduce((set, curr) => set.add(curr), new Set()))
    .map(letterSet => letterSet.size)
    .reduce((a,b) => a + b);

console.log(sum1);

function mapWithTotal(total) {
    const m = new Map();
    m.total = total;
    return m;
}

function toCounts(map, selection) {
    [...selection].forEach(letter => {
        const count = map.get(letter) || 0;
        map.set(letter, count + 1);
    });
    return map;
}

const sum2 = groups
    .map(group => group.split('\n'))
    .map(selections => selections.reduce(toCounts, mapWithTotal(selections.length)))
    .map(counts => [...counts.values()]
        .filter(v => v === counts.total)
        .reduce((a,b) => a + 1, 0)
    )
    .reduce((a,b) => a + b, 0);

console.log(sum2);