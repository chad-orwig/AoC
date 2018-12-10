const input = require('./input');
const _ = require('lodash');

function logOutput(points) {
    const minX = _.minBy(points, 'posX').posX;
    const maxX = _.maxBy(points, 'posX').posX;
    const minY = _.minBy(points, 'posY').posY;
    const maxY = _.maxBy(points, 'posY').posY;

    const xSize = Math.abs(maxX - minX);

    const rows = [];
    for(let y = minY; y <= maxY; y++) {
        rows.push(new Array(xSize + 1).fill('.'));
    }
    points.forEach(point => {
        rows[point.posY - minY][point.posX - minX] = '#';
    });
    rows.forEach(row => console.log(row.join('')));
}

// function xSize(points) {
//     const minX = _.minBy(points, 'posX').posX;
//     const maxX = _.maxBy(points, 'posX').posX;
//     return Math.abs(maxX - minX);
// }
//
// const results = [];
// for(let i = 0; i < 100000; i++) {
//     const size = xSize(input);
//     results.push({index: i, size});
//     input.forEach(point => point.loop());
// }
//
// console.log(_.minBy(results, 'size'));

//Min is 10521

for(let i =0 ; i < 10521; i++) {
    input.forEach(point => point.loop());
}

logOutput(input);