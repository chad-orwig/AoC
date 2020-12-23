import LinkedList from 'linked-list';
const input = '156794823'
    .split('')
    .map(Number);

LinkedList.Item.prototype.dNext = function() {
    return this.next || this.list.head;
}

function doAnswer(totalSize, totalRounds) {
    const cupMap = input.map(() => new LinkedList.Item())
        .map((cup, index) => {
            cup.label = input[index];
            return cup;
        })
        .reduce((map, cup) => map.set(cup.label, cup), new Map());
    
    let max = [...cupMap.keys()].reduce((a,b) => Math.max(a,b));
    const min = [...cupMap.keys()].reduce((a,b) => Math.min(a,b));

    const numToAdd = totalSize - cupMap.size;
    for(let i = 0; i < numToAdd; i++) {
        const cup = new LinkedList.Item();
        cup.label = max + 1;
        max = cup.label;
        cupMap.set(cup.label, cup);
    }

    const list = LinkedList.from(cupMap.values());

    const findDestinationCup = (cupMap) => {
        const finder = (label, selectedCups) => {
            const destinationLabel = label === min ? max : label - 1;
            const destinationCup = cupMap.get(destinationLabel);

            return selectedCups.every(cup => cup.label !== destinationLabel) ?
                destinationCup : finder(destinationLabel, selectedCups);
        };

        return finder;

    }

    const gameRound = (list, destinationCupFinder) => (currentCup = list.head) => {
        const cups = [...Array(3).keys()]
            .reduce((arr,i) => {
                arr[i] = arr?.[i-1]?.dNext() ?? currentCup.dNext();
                return arr;
            }, Array(3));
        
        cups.forEach(c => c.detach());

        const destinationCup = destinationCupFinder(currentCup.label, cups);
        destinationCup.append(cups[0]);
        cups[0].append(cups[1]);
        cups[1].append(cups[2]);

        return currentCup.dNext();
    }

    const playRound = gameRound(list, findDestinationCup(cupMap));

    let currentCup = list.head;
    for(let i = 0; i < totalRounds; i++) {
        currentCup = playRound(currentCup);
    }

    return [list, cupMap];
}

const [pt1List, pt1Map] = doAnswer(input.length, 100);

const cupOrder = [...Array(pt1List.size).keys()]
        .reduce((arr, i) => {
            const nextCup = arr?.[i - 1]?.dNext() ?? pt1Map.get(1);
            arr.push(nextCup);
            return arr;
        },[])
        .map(cup => cup.label);

    console.log(cupOrder.slice(1).join(''));

const [pt2List, pt2Map] = doAnswer(1000000, 10000000);

const cup1 = pt2Map.get(1);

console.log(cup1.dNext().label * cup1.dNext().dNext().label);