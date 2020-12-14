import input, {testInput} from './input.js';

console.log(input);

const available = input.busIds
    .filter(id => id !== 'x')
    .map(Number);

console.log(available);

const busToCatch = available
    .map(id => id - (input.earliest % id))
    .reduce((acc, remainder, i) => {
        if(!acc || remainder < acc.remainder) return { id: available[i], remainder }

        return acc;
    }, null)

console.log(busToCatch);

console.log(busToCatch.id * busToCatch.remainder);

const offsets = input.busIds
    .map((id, i) => {
        if(id === 'x') return null;
        return { id: Number(id), offset: i};
    })
    .filter(offset => offset);

console.log(offsets);

const formula = offsets
    .map(({id, offset}, i) => {
        const letter = String.fromCharCode(97 + i);
        return `${letter} * ${id} = x + ${offset}`;
    })
    .join(', ');

console.log('slam this in wolfram alpha');
console.log(formula);


function combineBusInterval(bus1, bus2) {
    
}
