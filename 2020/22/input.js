import LinkedList from 'linked-list';
const rawInput = `Player 1:
31
33
27
43
29
25
36
11
15
5
14
34
7
18
26
41
19
45
12
1
8
35
44
30
50

Player 2:
42
40
6
17
3
16
22
23
32
21
24
46
49
48
38
47
13
9
39
20
10
2
37
28
4`;

export const [player1, player2] = rawInput
    .split('\n\n')
    .map(str => str.split('\n'))
    .map(arr => arr.slice(1))
    .map(arr => arr.map(Number)
        .map(num => {
            const item = new LinkedList.Item();
            item.val = num;
            return item;
        })
    )
    .map(arr => LinkedList.from(arr));
    