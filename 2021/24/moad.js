const usePrevZ = [ false, false, false, true, true, false, true, true, false, true, false, false, true, true]
const addToX = [ 12, 14, 11, -9, -7, 11, -1, -16, 11, -15, 10, 12, -4, 0];
const addToY = [ 15, 12, 15, 12, 15,  2, 11,  15, 10,   2,  0,  0, 15, 15 ];
// 911 7 6898949959
export default function moad(num) {
    const digits = num.toString().split('').map(Number);
    const zChain = [ { value: 0, remainder: 0 }, { value: 0, remainder: 0 } ];
    digits.forEach((inp, i) => {
        const loopResult = loop(inp, zChain, usePrevZ[i], addToX[i], addToY[i]);
        
    });

    const last = zChain[zChain.length - 1];
    return last.value === 0 && last.remainder === 0;
}

function loop (inp, zChain, usePrevZ, addToX, addToY) {

    const prevRemainder = zChain[zChain.length - 1].remainder;
    
    if(usePrevZ) zChain.pop();
    const remainderCheck = inp === (prevRemainder + addToX);
    if(!remainderCheck) {
        const last = zChain[zChain.length - 1];
        zChain.push({
            value : (last.value + last.remainder) * 26,
            remainder: inp + addToY
        });
    }
}