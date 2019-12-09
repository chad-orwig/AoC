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

module.exports = {
    permutations,
    staticInputGenerator
};