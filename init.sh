#!/bin/bash
mkdir -p $1/$2
touch $1/$2/index.ts
if [ ! -f $1/$2/input.txt ]
then
    curl -H "Cookie: session=${AOC_SESSION}" "https://adventofcode.com/$1/day/$2/input" >> $1/$2/input.txt
    echo -n 'export const input=`' > $1/$2/input.ts
    cat $1/$2/input.txt >> $1/$2/input.ts
    perl -i -pe "chomp if eof" $1/$2/input.ts
    echo '`;' >> $1/$2/input.ts
fi
bun --watch $1/$2