import { input, ConditionRecord, symbolLookup } from './input.js';

// const expand = input
//   .flatMap(r => r.quantumSplit())
//   .filter(r => {
//     const actuals = r.getActualGroups();
//     return actuals.length === r.damagedGroups.length && actuals.every((g,i) => r.damagedGroups[i] === g)
//   });

// console.log(expand.length);

function* idGen() {
  let id = 0;
  while (true) {
    yield id;
    id += 1;
  }
}

const ids = idGen();

const allMatch = (group) => group.every((v) => v === symbolLookup.damaged || v === symbolLookup.unknown);
const nextIsFine = (conditions, nextIndex, size) => conditions[nextIndex + size] !== symbolLookup.damaged;
const prevIsFine = (conditions, i) => conditions[i - 1] !== symbolLookup.damaged;
/**
 * @typedef {{ found: number | null, forced: boolean, id: number, size: number }} GroupOption 
 * @param {ConditionRecord} record 
 * @param {number} start 
 * @param {number} size 
 * @returns {GroupOption}
 */
function findNextOption(record, start, size) {
  let conditions = record.conditions.slice(start);
  let trimmed = start;
  let found = null;
  let forced = false;
  const {value: id} = ids.next();
  while (found === null && size <= conditions.length) {
    const nextIndex = conditions.findIndex((s) => s === symbolLookup.damaged || symbolLookup.unknown);
    const potential = trimmed + nextIndex;
    if(nextIndex + size > conditions.length) break;
    const group = conditions.slice(nextIndex, size);
    if (allMatch(group) && nextIsFine(conditions, nextIndex, size) && prevIsFine(record.conditions, potential)) {
      found = potential;
      forced = conditions[nextIndex] === symbolLookup.damaged;
    }
    else if(conditions[nextIndex] === symbolLookup.damaged){
      break;
    }
    else {
      trimmed += nextIndex + 1;
      conditions = conditions.slice(nextIndex + 1);
    }

  }

  return { found, forced, id, size, record };

}
/**
 * 
 * @param {ConditionRecord} record 
 * @param {number} start 
 * @param {number} size 
 * @returns {GroupOption[]}
 */
function findAllOptions(record, start, size) {
  /** @type {GroupOption[]} */
  const options = [];
  let nextOption = null;
  let nextStart = start;
  while(nextOption?.found !== null) {
    nextOption = findNextOption(record, nextStart, size);
    if(nextOption.found !== null) {
      options.push(nextOption);
      nextStart = nextOption.found + 1;
    }
  }
  return options;
}

/**
 * 
 * @param {ConditionRecord} record 
 * @returns {GroupOption[][]}
 */
function findAllGroupOptions(record) {
  return record.damagedGroups
    .reduce((arr, size, i) => {
      const last = arr?.[i-1]?.[0];
      const start = last ? last.found + record.damagedGroups[i - 1] + 1 : 0;
      arr.push(findAllOptions(record, start, size));
      return arr;
    }, []);
}

/**
 * @param {GroupOption} option
 * @param {GroupOption[][]} all
 * @param {number} level
 * @returns {number[]}
 */
function buildConnections(all, option, level) {
  let potentials = (all?.[level + 1] ?? [])
    .filter(({found}) => found > option.found + option.size + 1);
  const firstForce = potentials.findIndex(({forced}) => forced);
  if(firstForce !== -1) {
    potentials = potentials.slice(0, firstForce + 1);
  }
  return potentials.map(({id}) => id);
}
/**
 * @typedef {{option: GroupOption, connections: number[] }} ConnectedOption
 * @param {GroupOption[][]} options 
 * @param {number} level 
 * @returns {ConnectedOption[]}
 */
function buildConnectionsForLevel(options, level) {
  return options[level].map(option => ({ option, connections: buildConnections(options, option, level )}));
}
/**
 * 
 * @param {GroupOption[][]} options 
 * @returns {ConnectedOption[][]}
 */
function buildAllConnections(options) {
  return options.map((_,i) => buildConnectionsForLevel(options, i));
}

/**
 * 
 * @param {ConnectedOption[][]} options
 */
function forceLastIfPossible(options) {
  return options.map((level, i) => {
    if (i< options.length - 1) return level;
    const lastForcedArr = level
      .map(({option}, i) => [option, i])
      .filter(([{forced}]) => forced)
      .map(([,i]) => i);
    if (lastForcedArr.length) {
      return level.filter((_,i) => i >= lastForcedArr[lastForcedArr.length - 1]);
    }
    return level;
  })
}
/**
 * @class
 * @param {ConnectedOption} co 
 * @param {number[]} prevPath 
 */
function Step(co, prevPath) {
  this.path = [...prevPath, co.option.id];
  this.co = co;
}
/**
 * 
 * @param {ConnectedOption[][]} options
 */
function solve(options) {
  const optionMap = new Map(options
    .flatMap(o => o)
    .map((o) => [o.option.id, o]));

  const steps = options[0].map(co => new Step(co, []));
  let complete = 0;
  while(steps.length) {
    const cur = steps.pop();
    if(cur.path.length === options.length) complete += 1;
    const next = cur.co.connections.map(id => optionMap.get(id))
      .filter(co => co)
      .map(co => new Step(co, cur.path));
    steps.push(...next);
  }
  return complete;
}

const p1 = input
  .map(findAllGroupOptions)
  // .map(buildAllConnections)
  // .map(forceLastIfPossible);

console.log(p1[0])