#!/bin/bash
mkdir -p $1/$2
touch $1/$2/index.js
if [ ! -f $1/$2/input.txt ]
then
    curl -H "Cookie: session=${AOC_SESSION}" "https://adventofcode.com/$1/day/$2/input" >> $1/$2/input.txt
    echo -n 'export const input=`' > $1/$2/input.js
    cat $1/$2/input.txt >> $1/$2/input.js
    echo '`;' >> $1/$2/input.js
fi
nodemon runProblem.js $1 $2