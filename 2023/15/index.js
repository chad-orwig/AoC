import { input } from './input.js';
import { List, Item } from 'linked-list';

/**
 * 
 * @param {string} s 
 * @returns {number}
 */
function hash(s) {
  let curr = 0;
  for(let i = 0; i < s.length; i++) {
    curr += s.charCodeAt(i);
    curr *= 17;
    curr %= 256;
  }
  return curr;
}

const p1 = input.map(s => hash(s))
  .reduce((a,b) => a+b);

console.log(p1);

/**
 * @class
 * @param {string} label 
 * @param {string} operation 
 * @param {number?} focalLength 
 */
function Step(label, operation, focalLength) {
  this.label = label;
  this.operation = operation;
  this.focalLength = focalLength;
  this.labelHash = hash(label);
}
const opRegex = /-|=/g;
const steps = input.map(s => s.split(opRegex))
  .map(([label, focalLength]) => focalLength ? 
    new Step(label, "=", Number(focalLength)) :
    new Step(label, "-", null)
  );

const boxes = Array(256)
  .fill(undefined)
  .map(() => new List());

class Lens extends Item {
  /**
   * 
   * @param {number} focalLength 
   */
  constructor(focalLength) {
    super();
    this.focalLength = focalLength;
  }
}

/** @type {Map<string, Lens>} */
const labels = new Map();

/**
 * 
 * @param {Step} step 
 */
function minusOp(step) {
  const lens = labels.get(step.label);
  if(lens) {
    lens.detach();
    labels.delete(step.label);
  }
}

/**
 * 
 * @param {Step} step 
 */
function equalsOp(step) {
  const newLens = new Lens(step.focalLength);
  const oldLens = labels.get(step.label);
  labels.set(step.label, newLens);
  if (oldLens) {
    oldLens.append(newLens);
    oldLens.detach();
  }
  else {
    boxes[step.labelHash].append(newLens);
  }
}

/**
 * 
 * @param {Step} step 
 */
function executeStep(step) {
  if(step.operation === '=') equalsOp(step);
  else minusOp(step);
}

steps.forEach(executeStep);

const p2 = boxes.map((list) => list.toArray())
  .flatMap((list, i) => list.map((lens, j) => [lens.focalLength, i + 1, j + 1]))
  .map(([focalLength, i, j]) => focalLength * i * j)
  .reduce((a,b) => a + b);


console.log(p2);