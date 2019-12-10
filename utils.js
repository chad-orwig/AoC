const filter = require('lodash/fp/filter');
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

function mapCoordinateGetter(map) {
    return (x,y) => map.get(x) && map.get(x).get(y);
}
function mapCoordinateSetter(map) {
    return (x,y,o) => {
        if(!map.get(x)) {
            map.set(x, new Map());
        }
        map.get(x).set(y, o);
    }
}

function mapCoordinateDeleter(map) {
    return (x,y) => map.get(x) && map.get(x).get(y) && map.get(x).delete(y);
}

function mapCoordinateSize(map) {
    return () => {
        let size = 0;
        map.forEach(subMap => size += subMap.size);
        return size;
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