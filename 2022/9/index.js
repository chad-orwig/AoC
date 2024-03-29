import { input, test } from './input.js';

const travelFunctions = {
  'L': ({x,y}) => ({ x: x - 1, y }),
  'R': ({x,y}) => ({ x: x + 1, y }),
  'U': ({x,y}) => ({ x, y: y - 1 }),
  'D': ({x,y}) => ({ x, y: y + 1 }),
}

function getChaseFunction({x,y}) {
  const diffString = `${x},${y}`;
  switch (diffString) {
    case '2,0': return travelFunctions.R;
    case '-2,0': return travelFunctions.L;
    case '0,2': return travelFunctions.D;
    case '0,-2': return travelFunctions.U;

    case '2,2':
    case '1,2':
    case '2,1': return (tail) => travelFunctions.R(travelFunctions.D(tail));
    case '-2,2':
    case '-1,2':
    case '-2,1': return (tail) => travelFunctions.L(travelFunctions.D(tail));

    case '2,-2':
    case '1,-2':
    case '2,-1': return (tail) => travelFunctions.R(travelFunctions.U(tail));
    case '-2,-2':
    case '-1,-2':
    case '-2,-1': return (tail) => travelFunctions.L(travelFunctions.U(tail));
  }
}

const k1Visits = new Set(['0,0']);
const k9Visits = new Set(['0,0']);

function chase(k1, k2) {
  const diffs = {
    x: k1.x - k2.x,
    y: k1.y - k2.y,
  };
  if(Math.abs(diffs.x) < 2 && Math.abs(diffs.y) < 2) {
    return k2;
  }
  const chaseFunction = getChaseFunction(diffs);

  const newKnot = chaseFunction(k2);

  return newKnot;
}

function tick(dir, knots) {
  const newKnots = knots.reduce((newArr, knot, i) => {
    if(newArr.length === 0) return [travelFunctions[dir](knot)];
    let prev = newArr[i - 1];
    return [...newArr, chase(prev, knot)];
  }, []);
  const k1 = newKnots[1];
  const k9 = newKnots[9];
  k1Visits.add(`${k1.x},${k1.y}`);
  k9Visits.add(`${k9.x},${k9.y}`);
  return newKnots;

}

const startKnot = () => ({x: 0, y: 0});

let rope = Array.from({length: 10}).map(startKnot);

input.forEach(({dir, num}) => {
  for (let i = 0; i < num; i++) {
    rope = tick(dir, rope);
  }
});
console.log(k1Visits.size);
console.log(k9Visits.size);