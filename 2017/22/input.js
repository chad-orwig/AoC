const testInput = '..#\n' +
    '#..\n' +
    '...';

const input = '#..#...#.#.#..#.#...##.##\n' +
    '.....##.#....#.#......#.#\n' +
    '..#.###.#.#######.###.#.#\n' +
    '.......#.##.###.###..##.#\n' +
    '#....#...#.###....##.....\n' +
    '#.....##.#########..#.#.#\n' +
    '.####.##..#...###.##...#.\n' +
    '#....#..#.###.##.#..##.#.\n' +
    '#####.#.#..#.##..#...####\n' +
    '##.#.#..#.#....###.######\n' +
    '.##.#...#...##.#.##..####\n' +
    '...#..##.#.....#.#..####.\n' +
    '#.##.###..#######.#..#.#.\n' +
    '##....##....##.#..#.##..#\n' +
    '##.#.#.#.##...##.....#...\n' +
    '.#####..#.#....#.#######.\n' +
    '####....###.###.#.#..#..#\n' +
    '.###...#.###..#..#.#####.\n' +
    '#.###..#.#######.#.#####.\n' +
    '.##.#.###.##.##.#.#...#..\n' +
    '######.###.#.#.##.####..#\n' +
    '##..####.##..##.#...##...\n' +
    '...##.##...#..#..##.####.\n' +
    '#.....##.##.#..##.##....#\n' +
    '#.#..####.....#....#.###.';

function findOffset(lines) {
    const middleRow = Math.floor(lines.length / 2);
    const middleCol = Math.floor(lines[middleRow].length / 2);

    return {
        y : -middleRow,
        x : -middleCol
    }
}
const _ = require('lodash');
const lines = input.split('\n');
const offset = findOffset(lines);
const map = {};
_.forEach(lines, (line, rowNum) => {
    _.forEach(line, (character, colNum) => {
       const y = rowNum + offset.y;
       const x = colNum + offset.x;
       if(character === '#') {
           map[`${x},${y}`] = 'i';
       }
    });
});

module.exports = map;