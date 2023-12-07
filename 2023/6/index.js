import { raceRecords, megaTime } from './input.js';

/**
 *      
 * @param {number} a 
 * @param {number} b 
 * @param {number} c 
 * @returns {[number, number]}
 */
function quadradicEquation(a,b,c) {
  const bSquaredStuff = Math.sqrt(Math.pow(b,2) - (4 * a * c));
  const twoA = 2 * a;

  return [(-b + bSquaredStuff)/ twoA, (-b - bSquaredStuff)/twoA];
}
console.time("p1")
const p1 = raceRecords
  .map(({ time, distance }) => {
    return quadradicEquation(-1, time, -distance);
  })
  .map(([left, right]) => ([Math.ceil(left), Math.ceil(right)]))
  .map(([r1, r2]) => Math.max(r1,r2) - Math.min(r1,r2))
  .reduce((a,b) => a * b);
console.log(p1);
console.timeEnd("p1");
console.time("p2")
const p2Roots = quadradicEquation(-1, megaTime[0], -megaTime[1])
  .map(Math.ceil);


console.log(Math.max(...p2Roots) - Math.min(...p2Roots));
console.timeEnd("p2")