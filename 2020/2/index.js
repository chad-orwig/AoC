import input from './input.js'
const testStr = `1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`;

const cmdRegex = /(\d+)-(\d+) (\w): (\w+)$/;

function parseInput(inp) {
    const arr = inp.split('\n');
    return arr.map(parseCommand);
}

function parseCommand(cmdStr) {
    const [_, min, max, req, password] = cmdRegex.exec(cmdStr);
    return {
        min: Number(min),
        max: Number(max),
        req,
        password
    }
}

function isValid(cmd) {
    const count = (cmd.password.match(new RegExp(cmd.req, "g")) || [] ).length;
    return count >= cmd.min &&
        count <= cmd.max;
}

function isValid2(cmd) {
    const char1 = cmd.password.charAt(cmd.min - 1);
    const char2 = cmd.password.charAt(cmd.max - 1);
    return (char1 === cmd.req) !== (char2 === cmd.req);
}

function ans(input, filter=isValid) {
    console.log(parseInput(input).filter(filter).length);
}

ans(testStr);
ans(input);

ans(testStr, isValid2);
ans(input, isValid2);
