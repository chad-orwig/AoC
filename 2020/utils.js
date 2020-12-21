export const toMapReducer = (property) => (map, o ) => map.set(o[property], o);

export function rotateSquareMapper(row, rowIndex, arr) {
    const max = arr.length - 1;
    return row.map((_, colIndex) => arr[max - colIndex][rowIndex]);
}

export function rotateSquare(square, numRotations=1) {
    if(numRotations < 1) return square;

    return rotateSquare(square.map(rotateSquareMapper), numRotations - 1);
}

export const tap = (val) => console.log(val) || val;