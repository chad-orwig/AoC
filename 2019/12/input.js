const notRelevant = /[^\d,\-]/g;

const input = 
`<x=-6, y=-5, z=-8>
<x=0, y=-3, z=-13>
<x=-15, y=10, z=-11>
<x=-3, y=-8, z=3>`
    .split('\n')
    .map(str => str.replace(notRelevant, ''))
    .map(str => str.split(','))
    .map(strArr => strArr.map(Number));


const test =
`<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>`
    .split('\n')
    .map(str => str.replace(notRelevant, ''))
    .map(str => str.split(','))
    .map(strArr => strArr.map(Number));

module.exports = input;