import { input } from "./input.js";


/**
 * 
 * @param {string} cave 
 * @returns {boolean}
 */
function isSmall(cave) {
    return cave.toLocaleLowerCase() === cave;
}

/**
 * @typedef {{cave: string, connections: Set<string>, isSmall: boolean|undefined}} CaveInfo
 * @typedef {Map<string, CaveInfo>} Tunnel
 * @param {string[][]} paths
 * @returns {Tunnel}
 */
function buildTunnel(paths) {
    /**
     * @type {Tunnel}
     */
    const tunnel = new Map();
    paths.forEach((caves) => {
        const [c1, c2] = caves.map(cave => {
            const caveInfo = tunnel.get(cave) ?? ({
                cave,
                connections: new Set(),
                isSmall: undefined,
            });
            if(caveInfo.isSmall === undefined) {
                caveInfo.isSmall = isSmall(cave);
                tunnel.set(cave, caveInfo);
            }
            return caveInfo;
        });
    
        c1.connections.add(c2.cave);
        c2.connections.add(c1.cave);
        
    });
    return tunnel;
}

const tunnel = buildTunnel(input);

/**
 * @typedef {{
 * lastCave: CaveInfo,
 * path: CaveInfo[],
 * tunnel: Tunnel,
 * smallCavesSeen: Set<CaveInfo>,
 * duplicateUsed: boolean
 * }} TunnelState
 * @param {TunnelState} state
 * @returns {Array<TunnelState>}
 */
function possibleNextCaves({path, tunnel, smallCavesSeen, lastCave, duplicateUsed}) {
    if(lastCave.isSmall) smallCavesSeen.add(lastCave);
    if(lastCave.cave === 'end') return [];

    return [...lastCave.connections]
        .map(cave => tunnel.get(cave))
        .filter(caveInfo => !duplicateUsed || !smallCavesSeen.has(caveInfo))
        .filter(caveInfo => caveInfo.cave !== 'start')
        .map(caveInfo => ({
            path: [...path, caveInfo],
            tunnel,
            smallCavesSeen: new Set(smallCavesSeen),
            lastCave: caveInfo,
            duplicateUsed: duplicateUsed || (caveInfo.isSmall && smallCavesSeen.has(caveInfo))
        }));
}
/**
 * @type {TunnelState[]}
 */
const states = [{
    path: [tunnel.get('start')],
    lastCave: tunnel.get('start'),
    tunnel,
    smallCavesSeen: new Set(),
    duplicateUsed: true
}];

const completePaths = [];

while(states.length) {
    const state = states.pop();
    if(state.lastCave.cave === 'end') completePaths.push(state);

    possibleNextCaves(state)
        .forEach(newState => states.push(newState));

}

console.log(completePaths.length);

/**
 * @type {TunnelState[]}
 */
 const pt2States = [{
    path: [tunnel.get('start')],
    lastCave: tunnel.get('start'),
    tunnel,
    smallCavesSeen: new Set(),
    duplicateUsed: false
}];

const completePathsPt2 = [];

while(pt2States.length) {
    const state = pt2States.pop();
    if(state.lastCave.cave === 'end') completePathsPt2.push(state);

    possibleNextCaves(state)
        .forEach(newState => pt2States.push(newState));

}

console.log(completePathsPt2.length);