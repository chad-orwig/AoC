const _ = require('lodash');
const input = require('./problem10input');
const valueRegex = /value (\d+) goes to bot (\d+)/;
const botRegex = /bot (\d+) gives low to (\w+) (\d+) and high to (\w+) (\d+)/;

const bots = {};
const outputs = {};

function readValueArgs(line) {
    const result = valueRegex.exec(line);
    const[value, botNum] = result.slice(1);
    return {value, botNum};
}

function getBot(bot) {
    if(!bots[bot]) {
        bots[bot] = {
            num     : bot,
            bot     : true,
            type    : 'bot',
            holding : []
        };
    }
    return bots[bot];
}

function resolveBot(bot) {
    if(bot.holding.length === 2 && bot.lowDest && bot.highDest) {
        const valuesAsNumbers = bot.holding.map(Number);
        const low = _.min(valuesAsNumbers);
        const high = _.max(valuesAsNumbers);

        if(low === 17 && high === 61) {
            console.log(`${bot.num} compares 17 and 61`);
        }

        bot.lowDest.holding.push(low);
        bot.highDest.holding.push(high);
        bot.holding = [];

        if(bot.lowDest.bot) {
            resolveBot(bot.lowDest);
        }

        if(bot.highDest.bot) {
            resolveBot(bot.highDest);
        }
    }
}

function executeValueStatement({value, botNum}) {
    const bot = getBot(botNum);
    bot.holding.push(value);
    resolveBot(bot);

}

function readBotArgs(line) {
    const result = botRegex.exec(line);
    const[source, lowType, lowNum, highType, highNum] = result.slice(1);
    return {source, lowType, lowNum, highType, highNum};
}

function getOutput(num) {
    if(!outputs[num]) {
        outputs[num] = {
            output : true,
            holding : [],
            type    : 'output'
        }
    }

    return outputs[num];
}

function getDestination(type, num) {
    if(type === 'bot') {
        return getBot(num);
    }
    else if(type === 'output') {
        return getOutput(num);
    }

    else {
        throw `Unparsable destination type=${type} num=${num}`;
    }
}

function executeBotStatement({source, lowType, lowNum, highType, highNum}) {
    const sourceBot = getBot(source);
    const lowDest = getDestination(lowType, lowNum);
    const highDest = getDestination(highType, highNum);

    sourceBot.lowDest = lowDest;
    sourceBot.highDest = highDest;

    resolveBot(sourceBot);
}

function readLine(line) {
    if(line.startsWith("value")) {
       const valueArgs = readValueArgs(line);
       executeValueStatement(valueArgs);
    }
    else if(line.startsWith('bot')) {
        const botArgs = readBotArgs(line);
        executeBotStatement(botArgs);
    }

    else {
        throw `Unparsable line: ${line}`;
    }
}

input.forEach(line => readLine(line));

console.log(outputs);
