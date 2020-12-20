export default function Tile(rawTile) {
    this.id = Number(rawTile[0].substring(5, 9));
    const rows = rawTile.slice(1)
        .map(str => str.split(''));
    this.borders = [
        rows[0],
        rows.map(row => row[row.length - 1]),
        [...rows[rows.length - 1]].reverse(),
        [...rows.map(row => row[0])].reverse(),
    ];
    this.inverseBorders = this.borders
        .map(row => [...row]
            .reverse());
    const temp = this.inverseBorders[1];
    this.inverseBorders[1] = this.inverseBorders[3];
    this.inverseBorders[3] = temp;

    this.variants = [
        this.variant(false, 0),
        this.variant(false, 1),
        this.variant(false, 2),
        this.variant(false, 3),
        this.variant(true, 0),
        this.variant(true, 1),
        this.variant(true, 2),
        this.variant(true, 3),
    ];
}

Tile.prototype.variant = function(flipped, rotation) {
    let borders = flipped ? [...this.inverseBorders] : [...this.borders];
    if(rotation) {
        borders = [...borders.slice(rotation), ...borders.slice(0, rotation)]
    }
    return new Variant(this, borders);
}

Tile.prototype.matchingVariants = function(otherVariant, matchDirection) {
    return this.variants
        .filter(v => v.matches(otherVariant, matchDirection));
}

export function Variant(parent, borders) {
    this.parent = parent;
    this.borders = borders;
}

export const MatchDirections = {
    LeftToRight : 1,
    TopToBottom : 2,
}

Variant.prototype.matches = function(otherVariant, matchDirection) {
    switch(matchDirection) {
        case MatchDirections.LeftToRight:
            return reverseMatch(otherVariant.borders[1], this.borders[3]);
        case MatchDirections.TopToBottom:
            return reverseMatch(otherVariant.borders[0], this.borders[2]);
        default: throw new Error(`Illegal match direction ${matchDirection}`);
    }
}

Variant.prototype.log = function() {
    this.borders.forEach(b => console.log(b.join('')));
}

function reverseMatch(arr1, arr2) {
    const max = arr1.length - 1;
    return arr1.findIndex((letter, index) => letter !== arr2[max - index]) === -1;

}

