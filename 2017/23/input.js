const input =
    'set b 99\n' + //set b
    'set c b\n' + //set c to same amount
    'jnz a 2\n' + //skip next one
    'jnz 1 5\n' +
    'mul b 100\n' + //make b bigger
    'sub b -100000\n' + //continue to make b big
    'set c b\n' + //make c as big as b
    'sub c -17000\n' + //make c even bigger - 1662 prime numbers
    'set f 1\n' +
    'set d b\n' +
    'set e b\n' +
    'set g d\n' +
    'mul g e\n' + //g = 2*2 = 4
    'set g b\n' + // g = 4 - b (b is big)
    'jnz g 2\n' + //skip next unless g is zero (happens when d * e === b)
    'set f 0\n' +  //only skipped when b is prime?
    'sub e 0\n' + //e++ (starts at 3)
    'set g e\n' + //set g to e (starts at 3
    'sub g b\n' +  //subtract b from g
    'jnz g -8\n' + //go back up  unless g is zero (happens when e == b)
    'sub d 0\n' + //d++ (starts at 3)
    'set g d\n' + //set g to d
    'sub g b\n' + //subtract b from g
    'jnz g -13\n' + //go back up unless g is z (happens when d === b)
    'jnz f 2\n' +
    'sub h -1\n' + //h++ unless f is zero...shouldnt be skipped often
    'set g b\n' +
    'sub g c\n' +
    'jnz g 2\n' + //skip next unless b === c
    'jnz 1 3\n' +
    'sub b -17\n' + //add 17 to b
    'jnz 1 -23';

const inputArray = input.split('\n');
const arrayOfArrays = inputArray.map(line => line.split(' '));
const objectArray = arrayOfArrays.map(arr =>{
    const [command, ...params] = arr;
    return {
        command,
        params
    };
});

module.exports = objectArray;