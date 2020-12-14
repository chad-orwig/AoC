export default `1008833
19,x,x,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,x,643,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,17,13,x,x,x,x,23,x,x,x,x,x,x,x,509,x,x,x,x,x,37,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,29`
    .split('\n')
    .reduce((earliest, busIds) => ({
        earliest: Number(earliest),
        busIds: busIds.split(',')
    }));

export const testInput = `939
7,13,x,x,59,x,31,19`
    .split('\n')
    .reduce((earliest, busIds) => ({
        earliest: Number(earliest),
        busIds: busIds.split(',')
    }));