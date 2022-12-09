import { input, test } from "./input.js";

const trees = input.map(row => row.map(height => ({ height })));

for(let col_i in trees) {
  for(let row_i in trees[col_i]) {
    let tree = trees[col_i][row_i];
    let slice = trees[col_i].slice(0,row_i).reverse();
    if(slice.length === 0) tree.left = 0
    else {
      let firstBigger = slice.findIndex(t => tree.height <= t.height);
      if(firstBigger === -1) tree.left = slice.length;
      else tree.left = firstBigger + 1;
    }

    slice = trees.map(row => row[row_i]).slice(0,col_i).reverse();
    if(slice.length === 0) tree.up = 0
    else {
      let firstBigger = slice.findIndex(t => tree.height <= t.height);
      if(firstBigger === -1) tree.up = slice.length;
      else tree.up = firstBigger + 1;
    }

    let rightIndex = trees[col_i].length - row_i - 1
    tree = trees[col_i][rightIndex];
    slice = trees[col_i].slice(rightIndex + 1);
    if(slice.length === 0) tree.right = 0
    else {
      let firstBigger = slice.findIndex(t => tree.height <= t.height);
      if(firstBigger === -1) tree.right = slice.length;
      else tree.right = firstBigger + 1;
    }

    let downIndex = trees.length - 1 - col_i;
    tree = trees[downIndex][row_i];
    slice = trees.map(row => row[row_i]).slice(downIndex + 1);
    if(slice.length === 0) tree.down = 0
    else {
      let firstBigger = slice.findIndex(t => tree.height <= t.height);
      if(firstBigger === -1) tree.down = slice.length;
      else tree.down = firstBigger + 1;
    }
  }
}

trees.forEach(row => row.forEach(tree => tree.score = tree.left * tree.right * tree.up * tree.down))

let maxScore = trees.map(row => row.map(({score}) => score)
  .reduce((a,b) => Math.max(a,b))
).reduce((a,b) => Math.max(a,b))

console.log(maxScore);