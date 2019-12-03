const input = require('./problem9input');
// const input = "X(8x2)(3x3)ABCY";
const markerRegex = /\(\d+x\d+\)/;

const result = decompressString(input);
console.log(result);

function decompressString(input) {
    let progress = {
        compressed: input,
        uncompressedLength : 0
    };

    while(progress.compressed) {
        progress = decompressNextChunk(progress);
    }
    return progress.uncompressedLength;
}

function decompressNextChunk({compressed, uncompressedLength}) {
    const regexResult = markerRegex.exec(compressed);
    if(regexResult) {
        const markerLength = regexResult[0].length;
        const [length, repeat] = regexResult[0].slice(1, markerLength - 1).split('x').map(Number);
        const preMarker = compressed.slice(0, regexResult.index);
        const markerEnd = regexResult.index + markerLength;
        const chunk = compressed.slice(markerEnd, markerEnd + length);
        const uncompressedChunkSize = decompressString(chunk);
        const result = uncompressedLength + preMarker.length + (uncompressedChunkSize * repeat);
        const theRest = compressed.slice(markerEnd + length);

        return {
            uncompressedLength : result,
            compressed: theRest
        };

    }

    else return {
        uncompressedLength : uncompressedLength + compressed.length
    };
}