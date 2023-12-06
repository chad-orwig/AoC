export const input = `Time:        47     84     74     67
Distance:   207   1394   1209   1014`;

const splitTimes = input
  .split('\n')
  .map(line => line.slice((/\d/.exec(line).index)))
  .map(line => line.split(/\s+/))
  .map(line => line.map(Number));

export const megaTime = input
  .split('\n')
  .map(line => line.slice((/\d/.exec(line).index)))
  .map(line => line.replaceAll(/\s/g, ''))
  .map(Number);

/**
 * @typedef RaceRecord
 * @prop {number} time
 * @prop {number} distance
 * 
 * @type {RaceRecord[]}
 */
export const raceRecords = splitTimes[0].map((time, index) => ({ time, distance: splitTimes[1][index]}));
