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


/**
 * 
 * @param {Map} map 
 * @returns {function(any[]):any}
 */
function mapCoordinateGetter(map) {
    return (idArray) => idArray.reduce(nestedMapGetter, map);
}
/**
 * 
 * @param {Map} map 
 * @returns {function(any[], any):any}
 */
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
    for(let [index, value] of mapOrNotMap) {
        const sub = explodeMap(value);
        result.push(...sub);
    }
    return result;
}

const mapByExplodeMap = flatMap(explodeMap);

function mapCoordinateSize(map) {
    
    return () => {
        return mapByExplodeMap([map]).length;
    }
}

function mapCoordinateCountBy(map) {
    return (filterFunc) => () => mapByExplodeMap([map]).filter(filterFunc).length
}

function mapExploder(map) {
    return () => mapByExplodeMap([map]);
}

function findMinX(map) {
    return Math.min(...Array.from(map.keys()));
}

const mapYs = flatMap(m => Array.from(m.keys()));
function findMinY(map) {
    const yList = mapYs(Array.from(map.values()));
    return Math.min(...yList);
        
}

function drawScreen(map, characterPicker) {
    const minY = findMinY(map);
    const minX = findMinX(map);
    let rows = [];
    for(let [x, subMap] of map) {
        for(let [y, val] of subMap) {
            if(!rows[y - minY]) {
                rows[y - minY] = [];
            }
            rows[y - minY][x - minX] = characterPicker(val) || ' ';
        }
    }
    for(let i = 0; i < rows.length; i++) {
        if(!rows[i]) {
            rows[i] = [];
        }
        else {
            for(let j = 0; j < rows[i].length; j++) {
                rows[i][j] = rows[i][j] || ' ';
            }
        }
    }
    rows.map(row => row.join('')).forEach(row => console.log(row));
}

function mapCoordinate2DPrint(map) {
    return (characterPicker) => () => drawScreen(map, characterPicker);
}

function negate(predicate) {
    return function() {
        return !predicate.apply(this, arguments);
    }
}
/**
 * @template {T}
 * @param {T} object 
 * @param {T[]} array 
 * @param {number} index 
 * @returns {T[]}
 */
function replaceInArray(object, array, index) {
    const clone = array.filter(() => true);
    clone[index] = object;
    return clone;
}

module.exports = {
    permutations,
    Maps : {
        mapCoordinateGetter,
        mapCoordinateSetter,
        mapCoordinateDeleter,
        mapCoordinateSize,
        mapCoordinateCountBy,
        mapCoordinate2DPrint,
        mapExploder,
        findMinX,
        findMinY,
    },
    staticInputGenerator,
    negate,
    replaceInArray,
};