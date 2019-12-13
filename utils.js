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

function drawScreen(map, characterPicker) {
    let rows = [];
    for(let [x, subMap] of map) {
        for(let [y, val] of subMap) {
            if(!rows[y]) {
                rows[y] = [];
            }
            rows[y][x] = characterPicker(val) || ' ';
        }
    }
    rows.map(row => row.join('')).forEach(row => console.log(row));
}

function mapCoordinate2DPrint(map) {
    return (characterPicker) => () => drawScreen(map, characterPicker);
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
        mapExploder
    },
    staticInputGenerator
};