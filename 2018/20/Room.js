const rooms = {};

function Room(parent, direction) {
    if(parent) {
        this.x = findX(parent, direction);
        this.y = findY(parent, direction);
    }
    else {
        this.x = 0;
        this.y = 0;
    }
    rooms[this.toString()] = this;
}

Room.prototype.travel = travel;
Room.prototype.toString = function() {
    return `${this.x},${this.y}`;
};

function travel(direction) {
    if(!this[direction]) {
        const inverseDirection = inverse(direction);
        const x = findX(this, inverseDirection);
        const y = findY(this, inverseDirection);
        const nextRoom = rooms[`${x},${y}`] || new Room(this, inverseDirection);

        this[direction] = nextRoom;
        nextRoom[inverseDirection] = this;
    }
    return this[direction];
}

const inverseMap = {
    N : 'S',
    S : 'N',
    E : 'W',
    W : 'E'
};

function inverse(direction) {
    return inverseMap[direction];
}

function findX(parent, direction) {
    if(direction === 'E') return parent.x - 1;
    if(direction === 'W') return parent.x + 1;
    return parent.x;
}

function findY(parent, direction) {
    if(direction === 'S') return parent.y - 1;
    if(direction === 'N') return parent.y + 1;
    return parent.y;
}

module.exports = {
    Room,
    rooms
};