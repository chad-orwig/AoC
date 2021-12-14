import { coordinates, folds } from "./input.js";
import utils from '../../utils.js';

const Maps = utils.Maps;

/**
 * @typedef {Map<number, Map<number, string>>} Paper
 * @type Paper
 */
const paper = new Map();
const setter = Maps.mapCoordinateSetter(paper);

coordinates.forEach(({x,y}) => setter([x, y], '#'));

/**
 * 
 * @param {import('./input.js').Fold} fold 
 * @param {Paper} paper
 * @returns {Paper} 
 */
function foldPaper(fold, paper) {
    switch(fold.axis) {
        case 'x':
            const maxX = Math.max(...paper.keys());
            const newWidth = Math.max(...[fold.value, maxX - fold.value]);
            /** @type Paper */
            const newPaper = new Map();
            for(let i = 0; i < newWidth; i++) {
                const targets = [fold.value + 1 + i, fold.value - 1 - i]
                    .map(target => paper.get(target))
                    .filter(yMap => yMap)
                    .flatMap(yMap => [...yMap.entries()]);
                const newYMap = new Map(targets);
                newPaper.set(i, newYMap);
            }
            return newPaper;

        case 'y':
            const minY = Maps.findMinY(paper);
            const newHeight = Math.min(...[fold.value, minY - fold.value]);
            
            const newEntries = [...paper.entries()]
                .map(([x, yMap]) => {
                    const newYEntries = [...yMap.entries()]
                        .map(([y, v]) => {
                            if(y < fold.value) {
                                const distanceFromBottom = fold.value - y;
                                const newY = newHeight + distanceFromBottom;
                                return [newY, v];
                            }
                            return [y, v];
                        });
                    
                    return [x, new Map(newYEntries)];
                });
            return new Map(newEntries);
    }
}
const pt1Paper = foldPaper(folds[0], paper);
const dotCount = Maps.mapExploder(pt1Paper)().length;

console.log(dotCount);

const finalPaper = folds.slice(1)
    .reduce((paper, fold) => foldPaper(fold, paper), pt1Paper);

Maps.mapCoordinate2DPrint(finalPaper)(v=>v)();