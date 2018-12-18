function Map() {

}

Map.prototype.get = function(x, y) {
    return this[`${x},${y}`];
};

Map.prototype.set = function(x,y, o) {
    this[`${x},${y}`] = o;
};

module.exports = Map;