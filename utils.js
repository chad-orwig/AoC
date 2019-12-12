const filter = require('lodash/fp/filter');
const flatMap = require('lodash/fp/flatMap');
function withoutIndexFunc(index) {
    return (item, i) => i !== index;
}
function permutations(arr) {
    if(arr.length <= 1) {
        return [arr];
    }
    const perms = [];
    for(let i = 0; i < arr.length; i++) {
        const start = arr[i];
        const slice = arr.filter(withoutIndexFunc(i));
        permutations(slice).forEach(smallPerms => perms.push([start, ...smallPerms]));
    }

    return perms;
}

function* staticInputGenerator (...inputs) {
    yield* inputs;
}

function nestedMapGetter(currentMap, currentVal) {
    return currentMap && currentMap.get(currentVal);
}

function nestedMapBuilder(currentMap, currentVal) {
    return currentMap.get(currentVal) || currentMap.set(currentVal, new Map()).get(currentVal);
}
function notLast(o, i, arr) {
    return i < arr.length - 1;
}

function mapCoordinateGetter(map) {
    return (idArray) => idArray.reduce(nestedMapGetter, map);
}
function mapCoordinateSetter(map) {
    return (idArray,o) => {
        return idArray
            .filter(notLast)
            .reduce(nestedMapBuilder, map)
            .set(idArray[idArray.length - 1], o);
    }
}

function mapCoordinateDeleter(map) {
    return (idArray) => {
        return idArray
            .filter(notLast)
            .reduce(nestedMapBuilder, map)
            .delete(idArray[idArray.length - 1]);
    }
}

function explodeMap(mapOrNotMap) {
    if(!(mapOrNotMap instanceof Map)) {
        return [mapOrNotMap];
    }

    let result = [];
    for(let value of mapOrNotMap) {
        result.push(...explodeMap(value));
    }
    return result;
}

const mapExploder = flatMap(explodeMap);

function mapCoordinateSize(map) {
    
    return () => {
        mapExploder(map).length;
    }
}

module.exports = {
    permutations,
    Maps : {
        mapCoordinateGetter,
        mapCoordinateSetter,
        mapCoordinateDeleter,
        mapCoordinateSize
    },
    staticInputGenerator
};