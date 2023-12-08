import lcm from 'compute-lcm';
import { nodeList, instructions, Node } from './input.js';

const nodes = nodeList.reduce((o,n) => Object.assign(o, { [n['source']]: n}), {});

let p1 = 0;
let currNode = nodes['AAA']

while (currNode !== nodes['ZZZ']) {
  const index = p1 % instructions.length;
  const instruction = instructions[index];
  currNode = instruction === 'L' ?
    nodes[currNode.left] :
    nodes[currNode.right];
  p1 += 1;
}

console.log(p1);

/**
 * 
 * @param {Node} n 
 * @returns {boolean}
 */
const atFinish = (n) => n.source.charAt(2) === 'Z';

let p2 = 0;
let currNodes = nodeList.filter(n => n.source.charAt(2) === 'A');
let rotations = currNodes.map(() => []);
while(p2 < 1000000) {
  const index = p2 % instructions.length;
  const instruction = instructions[index];

  currNodes = currNodes.map((node) => instruction === 'L' ?
    nodes[node.left] :
    nodes[node.right]);
  p2 += 1;
  
  currNodes.map((n, i) => /** @type{const} */([atFinish(n), i]))
    .filter(([finished]) => finished)
    .forEach(([_, i]) => rotations[i].push(p2));
}
const diffs = rotations.map((arr) => arr.map((v, i) => v - (arr[i - 1] ?? 0)));

const firstR = rotations.map(r => r[0]);

console.log(firstR);
console.log(diffs.map(d => d[0]));

console.log(lcm(firstR))
