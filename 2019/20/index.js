const input = require('./input');
const bfs = require('../../bfs');

function isOpen(val) {
    return val === '.';
}
function isLetter(val) {
    return val >= 'A' && val <= 'Z';
}

function Node(x,y) {
    this.x = x;
    this.y = y;
    this.connections = [];
    this.portals = [];
}

Node.prototype.addConnection = function(node) {
    this.connections.push(node);
    node.connections.push(this);
}

Node.prototype.addPortal = function (node) {
    this.portals.push(node);
    node.portals.push(this);
}

function isOuter(node) {
    return node.x === 2 ||
        node.x === input[0].length - 3 ||
        node.y === 2 ||
        node.y === input.length - 3;
}

function columnNodeBuilder(y) {
    return (val, x) => {
        if(!isOpen(val)) return val;
        return new Node(x,y);
    }
}

function rowNodeBuilder(row, y) {
    return row.map(columnNodeBuilder(y));
}

function reduceDown(node, val, rows, portals) {
    if(isLetter(val)) {
        if(isOuter(node)) node.outer = true;
        const label = val + rows[node.y + 2][node.x];
        if(portals[label]) node.addPortal(portals[label]);
        else portals[label] = node;
    }
}

function reduceRight(node, val, row, portals) {
    if(isLetter(val)) {
        if(isOuter(node)) node.outer = true;
        const label = val + row[node.x + 2];
        if(portals[label]) node.addPortal(portals[label]);
        else portals[label] = node;
    }
}

function reduceUp(node, val, rows, portals) {
    if(val instanceof Node) {
        node.addConnection(val);
    } else if(isLetter(val)) {
        if(isOuter(node)) node.outer = true;
        const label = rows[node.y - 2][node.x] + val;
        if(portals[label]) node.addPortal(portals[label]);
        else portals[label] = node;
    }
}

function reduceLeft(node, val, row, portals) {
    if(val instanceof Node) {
        node.addConnection(val);
    } else if(isLetter(val)) {
        if(isOuter(node)) node.outer = true;
        const label = row[node.x - 2] + val;
        if(portals[label]) node.addPortal(portals[label]);
        else portals[label] = node;
    }
}

function columnReducer(y, rows) {
    return (reduction, val, x, row) => {
        const {portals} = reduction;
        if(val instanceof Node) {
            reduceLeft(val, rows[y][x - 1], row, portals);
            reduceUp(val, rows[y -1][x], rows, portals);
            reduceRight(val, rows[y][x + 1], row, portals);
            reduceDown(val, rows[y + 1][x], rows, portals);
        }
        return reduction;
    };
}

function rowReducer(reduction, row, y, rows) {
    return row.reduce(columnReducer(y, rows), reduction);
}

const { portals } = input
    .map(rowNodeBuilder)
    .reduce(rowReducer, { portals : {}, nodes : {} });


function nextNodesPart1(node) {
    return node.connections.concat(node.portals);
}

function doneCheckerPart1(endNode) {
    return (node) => node === endNode ? 0 : 1;
}

const ans = bfs(portals.AA, nextNodesPart1, doneCheckerPart1(portals.ZZ), null, n => n);

console.log(ans);

portals.AA.outer = false;
portals.ZZ.outer = false;

function nextNodesPart2(start, end) {
    return ({node, level}) => {
        const directConnections = node.connections
            .filter(connection => {
                if(level === 1 && connection.outer) return false;
                if(level > 1) {
                    return connection !== start && connection !== end;
                }
                return true;
            })
            .map(connection => ({node: connection, level}));
        const portalConnections = node.portals
            .map(connection => {
                const newLevel = node.outer ? level - 1 : level + 1;
                return {
                    node : connection,
                    level : newLevel
                };
            });

        return directConnections.concat(portalConnections);

    }
}

function nodeLevelHash({node, level}) {
    return [level, node.x, node.y].join(',');
}

function doneCheckerPart2(endNode) {
    return ({node}) => node === endNode ? 0 : 1;
}

const ans2 = bfs({
    node : portals.AA,
    level : 1
}, nextNodesPart2(portals.AA, portals.ZZ), doneCheckerPart2(portals.ZZ), null, nodeLevelHash);

console.log(ans2);