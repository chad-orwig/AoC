export const input=`target area: x=32..65, y=-225..-177`
    .slice(15)
    .split(/[^0-9\-]+/)
    .map(Number);

export const testInput = 'target area: x=20..30, y=-10..-5'
.slice(15)
.split(/[^0-9\-]+/)
.map(Number);