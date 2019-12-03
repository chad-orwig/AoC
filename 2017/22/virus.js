const leftMap = {
    'u' : 'l',
    'l' : 'd',
    'd' : 'r',
    'r' : 'u'
};

const rightMap = {
    'u' : 'r',
    'r' : 'd',
    'd' : 'l',
    'l' : 'u'
};

const reverseMap = {
    'u' : 'd',
    'd' : 'u',
    'l' : 'r',
    'r' : 'l'
};

const movementMap = {
    'u' : {
        dx : 0,
        dy : -1
    },
    'l' : {
        dx : -1,
        dy : 0
    },
    'd' : {
        dx : 0,
        dy : 1
    },
    'r' : {
        dx : 1,
        dy : 0
    }
};

const infectionMap = {
    'c' : 'w',
    'w' : 'i',
    'i' : 'f',
    'f' : 'c'
};

function turnRight() {
    this.direction = rightMap[this.direction];
}
function turnLeft() {
    this.direction = leftMap[this.direction];
}

function reverse() {
    this.direction = reverseMap[this.direction];
}

function moveForward() {
    const {x, y} = this.loc;
    const {dx, dy} = movementMap[this.direction];

    this.loc = {
        x : x + dx,
        y : y + dy
    };
}

function burst() {
    const node = this.getCurrentNode();
    switch(node) {
        case 'w' :
            break;
        case 'i' :
            this.turnRight();
            break;
        case 'f' :
            this.reverse();
            break;
        case 'c' :
        default :
            this.turnLeft();
            break;
    }
    this.setNode(node);
    this.moveForward();
}


function setNode(state) {
    const locString = this.getLocString();
    const sanityState = state || 'c';
    const newState = infectionMap[sanityState];
    this.map[locString] = newState;
    if(newState === 'i') {
        this.infectCount++;
    }
}

function getLocString() {
    return `${this.loc.x},${this.loc.y}`;
}

function getCurrentNode() {
    return this.map[this.getLocString()];
}

function Virus(map) {
    this.map = map;
    this.burst = burst;
    this.getCurrentNode = getCurrentNode;
    this.getLocString = getLocString;
    this.loc = {
        x : 0,
        y : 0
    };
    this.direction = 'u';
    this.turnLeft = turnLeft;
    this.turnRight = turnRight;
    this.infectCount = 0;
    this.setNode = setNode;
    this.moveForward = moveForward;
    this.reverse = reverse;
}

module.exports = Virus;