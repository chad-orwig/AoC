import { input } from "./input.js";
import utils from '../../utils.js';
import 'colors';

const { Maps } = utils;

const [ enahncementString, inputImageString ] = input.split('\n\n');


function ENHANCE_IMAGE(image, defaultPixel) {
    const getter = Maps.mapCoordinateGetter(image);
    const minX = Maps.findMinX(image) - 2;
    const maxX = Maps.findMaxX(image) + 2;
    const minY = Maps.findMinY(image) - 2;
    const maxY = Maps.findMaxY(image) + 2;

    const newImage = new Map();
    const setter = Maps.mapCoordinateSetter(newImage);
    for(let x = minX; x <= maxX; x++) {
        for(let y = minY; y <= maxY; y++) {
            const newPixel = ENHANCE_PIXEL(x,y,getter, defaultPixel);
            setter([x,y], newPixel);
        }
    }

    return newImage;
}

function ENHANCE_PIXEL(x,y,getter, defaultPixel) {
    const binaryString = getRelevantPxels(x,y)
        .map(coords => getter(coords) || defaultPixel)
        .join('');

    const enhancementIndex = parseInt(binaryString, 2);
    const newVal = enahncementString.charAt(enhancementIndex) === '#' ? '1' : '0';
    return newVal;
}
function getRelevantPxels(x,y) {
    return [-1, 0, 1]
        .flatMap((ny, _i, arr) => arr.map(nx => [nx, ny]))
        .map(([nX, nY]) => [x + nX, y + nY]);
}

function readImage(str) {
    const image = new Map();
    const setter = Maps.mapCoordinateSetter(image);
    str.split('\n')
        .map(row => row.split(''))
        .forEach((row, y) => {
            row.forEach((val, x) => {
                const pixel = val === '#' ? '1' : '0';
                setter([x,y], pixel);
            })
        });
    return image;
}

const startingImage = readImage(inputImageString);

const pt1 = ENHANCE_IMAGE(ENHANCE_IMAGE(startingImage, '0'), '1');

console.log(Maps.mapExploder(pt1)().filter(v => v === '1').length);

let pt2 = startingImage;

for(let i = 0; i < 50; i++) {
    const defaultPixel = (i % 2).toString();
    pt2 = ENHANCE_IMAGE(pt2, defaultPixel);
}

console.log(Maps.mapExploder(pt2)().filter(v => v === '1').length);
