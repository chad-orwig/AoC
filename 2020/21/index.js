import input, { testInput } from './input.js';
import _ from 'lodash';

function mergeAlergenMaps(m1, m2) {
    m2.forEach((m2Set, alergen) => {
        if(m1.has(alergen)){
            const m1Set = m1.get(alergen);
            m1Set.forEach(ingredient => {
                if(!m2Set.has(ingredient)) {
                    m1Set.delete(ingredient);
                }
            })
        }
        else {
            m1.set(alergen, m2Set);
        }
    });

    return m1;
}

const alergenPossibilityMap = input.flatMap(({alergens, ingredients}) => alergens.map(alergen => new Map([[alergen, new Set([...ingredients])]])))
    .reduce(mergeAlergenMaps);

const fullIngredientsList = input.map(({ingredients}) => ingredients)
    .reduce((s1, s2) => new Set([...s1, ...s2]));

const potentiallyDirtyIngredients = [...alergenPossibilityMap]
    .map(([_, ingredientSet]) => ingredientSet)
    .reduce((s1, s2) => new Set([...s1, ...s2]));


const safeIngredients = [...fullIngredientsList]
    .filter(ingredient => !potentiallyDirtyIngredients.has(ingredient));

const safeIngredientCount = safeIngredients
    .flatMap(ingredient => input.map(({ingredients}) =>
        ingredients.has(ingredient) ? 1 : 0))
    .reduce((a,b) => a + b, 0)

console.log(safeIngredientCount);

const knownAlergens = determineKnownAlergens(alergenPossibilityMap);

const ans = [...knownAlergens.keys()]
    .sort()
    .map(a => knownAlergens.get(a))
    .join(',');
console.log(ans);

function determineKnownAlergens(possibilities, knownAlergens = new Map()) {
    const singles = [...possibilities]
        .filter(([alergen, ingredients]) => ingredients.size === 1)
        .map(([alergen, ingredients]) => ({ alergen, ingredient: [...ingredients][0]}));

    singles.forEach(({alergen, ingredient}) => knownAlergens.set(alergen, ingredient));

    const toRemove = singles.map(({ingredient}) => new Set([ingredient]))
        .reduce((s1, s2) => new Set([...s1, ...s2]));

    const remaining = [...possibilities]
        .filter(([_, ingredients]) => ingredients.size > 1)
        .map(([alergen, ingredients]) => [alergen, new Set([...ingredients].filter(ingredient => !toRemove.has(ingredient)))])
    
    return remaining.length === 0 ? knownAlergens : determineKnownAlergens(remaining, knownAlergens)
    
}