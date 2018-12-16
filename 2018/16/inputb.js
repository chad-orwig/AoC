const input =
    "1 2 3 0\n" +
    "1 0 0 3\n" +
    "0 2 0 2\n" +
    "6 2 3 2\n" +
    "8 3 2 0\n" +
    "0 0 3 0\n" +
    "10 1 0 1\n" +
    "15 1 1 2\n" +
    "1 3 3 3\n" +
    "1 1 3 0\n" +
    "1 2 0 1\n" +
    "1 1 3 0\n" +
    "0 0 2 0\n" +
    "10 0 2 2\n" +
    "15 2 0 3\n" +
    "1 0 2 1\n" +
    "1 1 1 0\n" +
    "1 3 0 2\n" +
    "0 0 2 0\n" +
    "0 0 2 0\n" +
    "10 0 3 3\n" +
    "15 3 3 1\n" +
    "1 0 0 2\n" +
    "1 3 0 0\n" +
    "1 0 1 3\n" +
    "13 2 0 0\n" +
    "0 0 1 0\n" +
    "10 1 0 1\n" +
    "15 1 2 0\n" +
    "1 2 2 2\n" +
    "1 1 3 1\n" +
    "12 2 3 3\n" +
    "0 3 1 3\n" +
    "0 3 1 3\n" +
    "10 0 3 0\n" +
    "15 0 1 1\n" +
    "1 3 1 2\n" +
    "1 0 1 3\n" +
    "1 3 2 0\n" +
    "2 0 2 2\n" +
    "0 2 1 2\n" +
    "10 1 2 1\n" +
    "15 1 1 2\n" +
    "0 2 0 0\n" +
    "6 0 1 0\n" +
    "0 0 0 1\n" +
    "6 1 2 1\n" +
    "1 2 1 3\n" +
    "12 1 3 0\n" +
    "0 0 3 0\n" +
    "10 0 2 2\n" +
    "15 2 1 0\n" +
    "1 3 3 1\n" +
    "1 0 2 3\n" +
    "1 3 1 2\n" +
    "8 3 2 3\n" +
    "0 3 3 3\n" +
    "10 0 3 0\n" +
    "15 0 2 3\n" +
    "1 3 1 0\n" +
    "1 0 2 2\n" +
    "1 0 2 1\n" +
    "13 2 0 0\n" +
    "0 0 3 0\n" +
    "10 0 3 3\n" +
    "1 3 2 2\n" +
    "0 0 0 0\n" +
    "6 0 3 0\n" +
    "1 2 1 1\n" +
    "11 1 0 0\n" +
    "0 0 3 0\n" +
    "10 3 0 3\n" +
    "1 1 3 0\n" +
    "0 3 0 1\n" +
    "6 1 1 1\n" +
    "1 2 2 2\n" +
    "15 0 2 1\n" +
    "0 1 2 1\n" +
    "10 3 1 3\n" +
    "15 3 0 2\n" +
    "1 3 2 1\n" +
    "1 2 2 3\n" +
    "1 0 2 0\n" +
    "14 1 3 1\n" +
    "0 1 3 1\n" +
    "0 1 2 1\n" +
    "10 2 1 2\n" +
    "15 2 3 0\n" +
    "1 3 2 2\n" +
    "1 3 1 1\n" +
    "2 1 2 3\n" +
    "0 3 3 3\n" +
    "10 0 3 0\n" +
    "15 0 3 1\n" +
    "0 3 0 3\n" +
    "6 3 1 3\n" +
    "1 1 3 0\n" +
    "1 2 0 2\n" +
    "15 0 2 0\n" +
    "0 0 1 0\n" +
    "10 0 1 1\n" +
    "15 1 1 0\n" +
    "1 3 2 1\n" +
    "1 0 3 2\n" +
    "1 2 3 2\n" +
    "0 2 1 2\n" +
    "10 2 0 0\n" +
    "15 0 2 1\n" +
    "1 1 3 0\n" +
    "1 0 3 3\n" +
    "1 2 3 2\n" +
    "7 3 2 3\n" +
    "0 3 3 3\n" +
    "10 3 1 1\n" +
    "15 1 2 0\n" +
    "0 2 0 2\n" +
    "6 2 0 2\n" +
    "1 3 0 3\n" +
    "1 0 0 1\n" +
    "2 3 2 3\n" +
    "0 3 1 3\n" +
    "10 3 0 0\n" +
    "15 0 2 3\n" +
    "1 3 1 0\n" +
    "0 3 0 1\n" +
    "6 1 3 1\n" +
    "2 0 2 2\n" +
    "0 2 3 2\n" +
    "10 2 3 3\n" +
    "15 3 0 2\n" +
    "1 2 2 0\n" +
    "1 2 0 3\n" +
    "0 1 0 1\n" +
    "6 1 2 1\n" +
    "5 0 3 0\n" +
    "0 0 2 0\n" +
    "10 2 0 2\n" +
    "15 2 3 0\n" +
    "1 0 1 2\n" +
    "0 1 0 1\n" +
    "6 1 1 1\n" +
    "1 1 2 3\n" +
    "0 3 2 2\n" +
    "0 2 3 2\n" +
    "0 2 2 2\n" +
    "10 2 0 0\n" +
    "15 0 1 2\n" +
    "1 1 2 0\n" +
    "1 0 1 3\n" +
    "1 3 0 1\n" +
    "6 0 1 0\n" +
    "0 0 1 0\n" +
    "0 0 3 0\n" +
    "10 2 0 2\n" +
    "15 2 0 1\n" +
    "0 1 0 0\n" +
    "6 0 0 0\n" +
    "1 2 2 2\n" +
    "7 3 2 3\n" +
    "0 3 2 3\n" +
    "0 3 2 3\n" +
    "10 3 1 1\n" +
    "1 0 2 3\n" +
    "12 2 3 0\n" +
    "0 0 2 0\n" +
    "10 1 0 1\n" +
    "0 2 0 3\n" +
    "6 3 3 3\n" +
    "0 0 0 2\n" +
    "6 2 0 2\n" +
    "0 3 0 0\n" +
    "6 0 2 0\n" +
    "2 3 2 3\n" +
    "0 3 1 3\n" +
    "10 3 1 1\n" +
    "1 2 3 3\n" +
    "1 3 3 2\n" +
    "1 1 3 0\n" +
    "9 0 3 2\n" +
    "0 2 1 2\n" +
    "10 2 1 1\n" +
    "15 1 1 3\n" +
    "1 3 3 2\n" +
    "1 0 0 1\n" +
    "6 0 1 1\n" +
    "0 1 3 1\n" +
    "10 1 3 3\n" +
    "15 3 2 2\n" +
    "1 3 2 3\n" +
    "1 1 0 1\n" +
    "10 0 0 1\n" +
    "0 1 1 1\n" +
    "10 2 1 2\n" +
    "15 2 1 1\n" +
    "1 0 2 2\n" +
    "1 3 1 0\n" +
    "0 0 0 3\n" +
    "6 3 2 3\n" +
    "8 2 3 3\n" +
    "0 3 2 3\n" +
    "10 3 1 1\n" +
    "15 1 0 2\n" +
    "1 2 0 0\n" +
    "1 1 1 3\n" +
    "0 2 0 1\n" +
    "6 1 3 1\n" +
    "4 0 3 1\n" +
    "0 1 2 1\n" +
    "0 1 2 1\n" +
    "10 2 1 2\n" +
    "1 3 1 1\n" +
    "1 2 3 3\n" +
    "3 0 1 0\n" +
    "0 0 2 0\n" +
    "10 2 0 2\n" +
    "15 2 3 1\n" +
    "1 0 3 2\n" +
    "1 3 3 0\n" +
    "8 2 3 0\n" +
    "0 0 2 0\n" +
    "0 0 2 0\n" +
    "10 0 1 1\n" +
    "15 1 3 0\n" +
    "1 2 2 2\n" +
    "1 3 2 1\n" +
    "1 0 2 3\n" +
    "7 3 2 1\n" +
    "0 1 2 1\n" +
    "10 0 1 0\n" +
    "15 0 0 3\n" +
    "0 0 0 2\n" +
    "6 2 0 2\n" +
    "1 3 1 1\n" +
    "1 1 1 0\n" +
    "6 0 1 0\n" +
    "0 0 3 0\n" +
    "0 0 2 0\n" +
    "10 3 0 3\n" +
    "15 3 3 1\n" +
    "1 1 2 0\n" +
    "0 2 0 2\n" +
    "6 2 2 2\n" +
    "1 0 1 3\n" +
    "7 3 2 2\n" +
    "0 2 1 2\n" +
    "10 2 1 1\n" +
    "15 1 1 2\n" +
    "0 1 0 0\n" +
    "6 0 2 0\n" +
    "1 2 2 1\n" +
    "1 1 1 3\n" +
    "4 0 3 1\n" +
    "0 1 2 1\n" +
    "10 1 2 2\n" +
    "0 1 0 3\n" +
    "6 3 2 3\n" +
    "0 1 0 1\n" +
    "6 1 1 1\n" +
    "1 1 1 0\n" +
    "10 1 0 1\n" +
    "0 1 2 1\n" +
    "10 1 2 2\n" +
    "15 2 3 3\n" +
    "0 3 0 1\n" +
    "6 1 3 1\n" +
    "0 1 0 2\n" +
    "6 2 0 2\n" +
    "6 0 1 1\n" +
    "0 1 3 1\n" +
    "10 3 1 3\n" +
    "15 3 1 0\n" +
    "1 2 0 3\n" +
    "0 2 0 1\n" +
    "6 1 3 1\n" +
    "8 2 3 3\n" +
    "0 3 3 3\n" +
    "10 0 3 0\n" +
    "1 1 1 3\n" +
    "1 0 0 1\n" +
    "0 3 2 3\n" +
    "0 3 1 3\n" +
    "10 3 0 0\n" +
    "15 0 3 1\n" +
    "1 1 3 3\n" +
    "1 3 1 0\n" +
    "0 2 0 2\n" +
    "6 2 2 2\n" +
    "11 2 0 0\n" +
    "0 0 1 0\n" +
    "10 1 0 1\n" +
    "15 1 3 0\n" +
    "1 0 0 3\n" +
    "0 2 0 2\n" +
    "6 2 3 2\n" +
    "1 1 3 1\n" +
    "0 1 2 3\n" +
    "0 3 1 3\n" +
    "0 3 3 3\n" +
    "10 0 3 0\n" +
    "15 0 1 2\n" +
    "1 1 3 0\n" +
    "0 2 0 1\n" +
    "6 1 0 1\n" +
    "1 1 0 3\n" +
    "6 0 1 1\n" +
    "0 1 3 1\n" +
    "10 2 1 2\n" +
    "15 2 3 0\n" +
    "1 3 2 1\n" +
    "1 0 2 2\n" +
    "6 3 1 2\n" +
    "0 2 3 2\n" +
    "10 2 0 0\n" +
    "1 0 3 1\n" +
    "1 0 3 3\n" +
    "0 3 0 2\n" +
    "6 2 2 2\n" +
    "7 3 2 1\n" +
    "0 1 3 1\n" +
    "10 0 1 0\n" +
    "15 0 2 1\n" +
    "1 1 3 3\n" +
    "0 3 0 0\n" +
    "6 0 3 0\n" +
    "0 2 0 2\n" +
    "6 2 0 2\n" +
    "1 2 3 3\n" +
    "0 3 1 3\n" +
    "10 1 3 1\n" +
    "15 1 1 2\n" +
    "1 2 3 3\n" +
    "1 2 3 1\n" +
    "14 0 1 0\n" +
    "0 0 1 0\n" +
    "10 2 0 2\n" +
    "15 2 0 0\n" +
    "0 0 0 3\n" +
    "6 3 0 3\n" +
    "1 2 0 2\n" +
    "1 0 2 1\n" +
    "7 3 2 2\n" +
    "0 2 1 2\n" +
    "0 2 3 2\n" +
    "10 0 2 0\n" +
    "15 0 3 3\n" +
    "1 2 2 2\n" +
    "1 2 2 1\n" +
    "0 1 0 0\n" +
    "6 0 3 0\n" +
    "11 1 0 1\n" +
    "0 1 3 1\n" +
    "10 1 3 3\n" +
    "15 3 3 1\n" +
    "1 2 1 0\n" +
    "0 0 0 3\n" +
    "6 3 1 3\n" +
    "1 0 0 2\n" +
    "4 0 3 3\n" +
    "0 3 1 3\n" +
    "10 3 1 1\n" +
    "15 1 1 3\n" +
    "1 1 3 0\n" +
    "1 1 1 1\n" +
    "10 1 0 2\n" +
    "0 2 3 2\n" +
    "10 2 3 3\n" +
    "15 3 1 1\n" +
    "1 2 1 3\n" +
    "1 2 2 2\n" +
    "12 2 3 3\n" +
    "0 3 3 3\n" +
    "10 1 3 1\n" +
    "15 1 3 2\n" +
    "1 2 1 1\n" +
    "1 2 2 3\n" +
    "1 3 2 0\n" +
    "14 0 3 1\n" +
    "0 1 1 1\n" +
    "10 1 2 2\n" +
    "1 2 0 1\n" +
    "11 1 0 1\n" +
    "0 1 3 1\n" +
    "0 1 2 1\n" +
    "10 1 2 2\n" +
    "1 2 2 1\n" +
    "14 0 1 1\n" +
    "0 1 2 1\n" +
    "0 1 2 1\n" +
    "10 1 2 2\n" +
    "15 2 0 0\n" +
    "1 0 2 2\n" +
    "1 3 3 1\n" +
    "0 0 0 3\n" +
    "6 3 3 3\n" +
    "2 3 2 1\n" +
    "0 1 1 1\n" +
    "10 0 1 0\n" +
    "15 0 1 1\n" +
    "1 0 2 3\n" +
    "0 1 0 2\n" +
    "6 2 3 2\n" +
    "1 1 3 0\n" +
    "8 3 2 3\n" +
    "0 3 2 3\n" +
    "0 3 3 3\n" +
    "10 3 1 1\n" +
    "15 1 3 2\n" +
    "1 2 3 3\n" +
    "1 2 3 1\n" +
    "0 0 0 0\n" +
    "6 0 2 0\n" +
    "5 0 3 3\n" +
    "0 3 1 3\n" +
    "10 2 3 2\n" +
    "15 2 0 3\n" +
    "1 1 0 0\n" +
    "0 3 0 2\n" +
    "6 2 0 2\n" +
    "0 0 2 0\n" +
    "0 0 2 0\n" +
    "10 0 3 3\n" +
    "15 3 3 1\n" +
    "0 1 0 0\n" +
    "6 0 3 0\n" +
    "1 2 1 3\n" +
    "1 1 3 2\n" +
    "2 0 2 3\n" +
    "0 3 1 3\n" +
    "0 3 2 3\n" +
    "10 1 3 1\n" +
    "1 1 1 0\n" +
    "1 2 3 3\n" +
    "1 2 3 2\n" +
    "15 0 2 3\n" +
    "0 3 1 3\n" +
    "10 1 3 1\n" +
    "1 3 3 0\n" +
    "1 1 2 3\n" +
    "3 2 0 3\n" +
    "0 3 1 3\n" +
    "0 3 2 3\n" +
    "10 1 3 1\n" +
    "15 1 2 0\n" +
    "1 3 2 2\n" +
    "1 1 0 3\n" +
    "1 3 3 1\n" +
    "2 1 2 3\n" +
    "0 3 3 3\n" +
    "0 3 3 3\n" +
    "10 3 0 0\n" +
    "1 0 0 3\n" +
    "0 1 0 1\n" +
    "6 1 2 1\n" +
    "1 2 3 2\n" +
    "7 3 2 1\n" +
    "0 1 2 1\n" +
    "10 0 1 0\n" +
    "15 0 3 2\n" +
    "1 2 0 0\n" +
    "1 2 0 3\n" +
    "1 3 2 1\n" +
    "5 0 3 1\n" +
    "0 1 3 1\n" +
    "0 1 1 1\n" +
    "10 1 2 2\n" +
    "15 2 3 1\n" +
    "1 3 0 3\n" +
    "1 1 2 0\n" +
    "0 1 0 2\n" +
    "6 2 0 2\n" +
    "2 3 2 3\n" +
    "0 3 3 3\n" +
    "10 1 3 1\n" +
    "15 1 1 2\n" +
    "1 3 0 1\n" +
    "1 2 1 3\n" +
    "1 0 2 0\n" +
    "14 1 3 3\n" +
    "0 3 3 3\n" +
    "0 3 3 3\n" +
    "10 3 2 2\n" +
    "15 2 1 1\n" +
    "1 0 2 2\n" +
    "1 2 3 0\n" +
    "0 0 0 3\n" +
    "6 3 1 3\n" +
    "0 3 2 0\n" +
    "0 0 3 0\n" +
    "10 1 0 1\n" +
    "15 1 0 3\n" +
    "1 2 2 2\n" +
    "1 1 3 0\n" +
    "1 3 0 1\n" +
    "10 0 0 0\n" +
    "0 0 3 0\n" +
    "10 3 0 3\n" +
    "15 3 0 0\n" +
    "0 3 0 2\n" +
    "6 2 0 2\n" +
    "1 1 1 3\n" +
    "6 3 1 3\n" +
    "0 3 1 3\n" +
    "0 3 3 3\n" +
    "10 0 3 0\n" +
    "15 0 1 1\n" +
    "0 0 0 2\n" +
    "6 2 2 2\n" +
    "1 1 2 3\n" +
    "1 2 0 0\n" +
    "4 0 3 3\n" +
    "0 3 1 3\n" +
    "0 3 2 3\n" +
    "10 1 3 1\n" +
    "1 0 1 0\n" +
    "1 0 0 2\n" +
    "1 2 3 3\n" +
    "8 2 3 3\n" +
    "0 3 2 3\n" +
    "10 1 3 1\n" +
    "1 3 3 0\n" +
    "1 2 1 3\n" +
    "14 0 3 2\n" +
    "0 2 3 2\n" +
    "10 1 2 1\n" +
    "15 1 0 2\n" +
    "1 2 0 0\n" +
    "1 3 1 1\n" +
    "3 0 1 3\n" +
    "0 3 3 3\n" +
    "10 2 3 2\n" +
    "15 2 2 3\n" +
    "1 3 0 2\n" +
    "14 1 0 2\n" +
    "0 2 3 2\n" +
    "10 3 2 3\n" +
    "15 3 3 1\n" +
    "1 0 2 0\n" +
    "1 0 2 2\n" +
    "0 1 0 3\n" +
    "6 3 2 3\n" +
    "1 2 0 0\n" +
    "0 0 1 0\n" +
    "0 0 1 0\n" +
    "10 1 0 1\n" +
    "15 1 3 3\n" +
    "1 3 3 1\n" +
    "1 2 3 0\n" +
    "1 1 1 2\n" +
    "14 1 0 1\n" +
    "0 1 3 1\n" +
    "10 1 3 3\n" +
    "15 3 0 2\n" +
    "1 0 2 1\n" +
    "1 2 1 3\n" +
    "5 0 3 1\n" +
    "0 1 1 1\n" +
    "10 2 1 2\n" +
    "15 2 3 1\n" +
    "1 0 1 3\n" +
    "1 1 0 0\n" +
    "1 2 1 2\n" +
    "7 3 2 0\n" +
    "0 0 3 0\n" +
    "0 0 2 0\n" +
    "10 1 0 1\n" +
    "0 2 0 0\n" +
    "6 0 3 0\n" +
    "1 1 2 3\n" +
    "1 3 3 2\n" +
    "0 3 2 0\n" +
    "0 0 2 0\n" +
    "10 0 1 1\n" +
    "15 1 0 0\n" +
    "1 0 3 2\n" +
    "0 1 0 1\n" +
    "6 1 0 1\n" +
    "6 3 1 1\n" +
    "0 1 1 1\n" +
    "10 1 0 0\n" +
    "15 0 1 3\n" +
    "1 1 0 0\n" +
    "1 0 2 1\n" +
    "6 0 1 1\n" +
    "0 1 2 1\n" +
    "0 1 3 1\n" +
    "10 3 1 3\n" +
    "15 3 1 0\n" +
    "1 0 1 1\n" +
    "1 2 3 3\n" +
    "8 2 3 3\n" +
    "0 3 1 3\n" +
    "0 3 1 3\n" +
    "10 3 0 0\n" +
    "15 0 0 1\n" +
    "1 1 1 3\n" +
    "0 0 0 0\n" +
    "6 0 2 0\n" +
    "1 2 0 2\n" +
    "9 3 0 3\n" +
    "0 3 3 3\n" +
    "0 3 1 3\n" +
    "10 1 3 1\n" +
    "1 3 3 2\n" +
    "1 2 2 3\n" +
    "13 0 2 2\n" +
    "0 2 1 2\n" +
    "10 2 1 1\n" +
    "15 1 0 0\n" +
    "1 0 0 3\n" +
    "1 1 3 1\n" +
    "1 2 2 2\n" +
    "7 3 2 3\n" +
    "0 3 2 3\n" +
    "0 3 3 3\n" +
    "10 3 0 0\n" +
    "15 0 2 1\n" +
    "1 1 2 0\n" +
    "1 3 2 2\n" +
    "1 2 0 3\n" +
    "9 0 3 3\n" +
    "0 3 3 3\n" +
    "10 3 1 1\n" +
    "1 1 0 3\n" +
    "1 2 2 0\n" +
    "9 3 0 2\n" +
    "0 2 3 2\n" +
    "10 1 2 1\n" +
    "1 0 0 2\n" +
    "9 3 0 0\n" +
    "0 0 3 0\n" +
    "10 1 0 1\n" +
    "15 1 3 2\n" +
    "1 2 0 1\n" +
    "1 2 2 0\n" +
    "9 3 0 0\n" +
    "0 0 2 0\n" +
    "10 2 0 2\n" +
    "1 2 2 3\n" +
    "1 2 1 0\n" +
    "12 1 3 3\n" +
    "0 3 1 3\n" +
    "10 3 2 2\n" +
    "1 1 0 0\n" +
    "0 1 0 3\n" +
    "6 3 2 3\n" +
    "9 0 3 1\n" +
    "0 1 1 1\n" +
    "10 1 2 2\n" +
    "15 2 2 0\n" +
    "0 2 0 2\n" +
    "6 2 3 2\n" +
    "1 3 0 1\n" +
    "14 1 3 2\n" +
    "0 2 2 2\n" +
    "10 0 2 0\n" +
    "15 0 1 2\n" +
    "1 2 1 0\n" +
    "0 1 0 1\n" +
    "6 1 1 1\n" +
    "1 1 0 3\n" +
    "4 0 3 3\n" +
    "0 3 2 3\n" +
    "10 2 3 2\n" +
    "15 2 0 0\n" +
    "0 3 0 3\n" +
    "6 3 0 3\n" +
    "1 2 3 2\n" +
    "7 3 2 1\n" +
    "0 1 3 1\n" +
    "10 1 0 0\n" +
    "15 0 2 1\n" +
    "1 2 0 0\n" +
    "0 2 0 3\n" +
    "6 3 3 3\n" +
    "1 3 2 2\n" +
    "13 0 2 0\n" +
    "0 0 2 0\n" +
    "0 0 1 0\n" +
    "10 1 0 1\n" +
    "1 2 3 2\n" +
    "1 0 3 3\n" +
    "1 0 1 0\n" +
    "12 2 3 2\n" +
    "0 2 2 2\n" +
    "10 1 2 1\n" +
    "15 1 1 2\n" +
    "1 0 0 1\n" +
    "1 2 1 3\n" +
    "1 2 3 0\n" +
    "5 0 3 3\n" +
    "0 3 2 3\n" +
    "10 3 2 2\n" +
    "15 2 1 3\n" +
    "1 3 1 0\n" +
    "1 2 3 2\n" +
    "3 2 0 1\n" +
    "0 1 2 1\n" +
    "10 1 3 3\n" +
    "15 3 1 1\n" +
    "0 1 0 0\n" +
    "6 0 2 0\n" +
    "0 3 0 3\n" +
    "6 3 1 3\n" +
    "4 0 3 2\n" +
    "0 2 1 2\n" +
    "10 2 1 1\n" +
    "15 1 0 3\n" +
    "1 1 0 0\n" +
    "1 0 0 1\n" +
    "1 1 2 2\n" +
    "6 0 1 1\n" +
    "0 1 3 1\n" +
    "10 1 3 3\n" +
    "15 3 0 0\n" +
    "0 1 0 1\n" +
    "6 1 2 1\n" +
    "1 3 1 3\n" +
    "1 0 0 2\n" +
    "14 3 1 2\n" +
    "0 2 1 2\n" +
    "10 0 2 0\n" +
    "15 0 3 3\n" +
    "0 3 0 2\n" +
    "6 2 1 2\n" +
    "1 3 0 0\n" +
    "0 1 0 1\n" +
    "6 1 3 1\n" +
    "2 0 2 1\n" +
    "0 1 2 1\n" +
    "10 1 3 3\n" +
    "15 3 3 1\n" +
    "1 2 0 0\n" +
    "1 2 2 2\n" +
    "1 1 2 3\n" +
    "4 0 3 0\n" +
    "0 0 2 0\n" +
    "10 0 1 1\n" +
    "15 1 1 3\n" +
    "1 3 0 1\n" +
    "1 1 2 0\n" +
    "1 0 2 2\n" +
    "0 0 2 1\n" +
    "0 1 2 1\n" +
    "10 3 1 3\n" +
    "1 2 0 1\n" +
    "1 2 3 2\n" +
    "15 0 2 0\n" +
    "0 0 1 0\n" +
    "10 0 3 3\n" +
    "15 3 1 0\n" +
    "1 3 1 1\n" +
    "0 1 0 3\n" +
    "6 3 1 3\n" +
    "6 3 1 3\n" +
    "0 3 3 3\n" +
    "10 0 3 0\n" +
    "15 0 3 1\n" +
    "1 0 0 3\n" +
    "1 3 0 0\n" +
    "11 2 0 2\n" +
    "0 2 1 2\n" +
    "10 1 2 1\n" +
    "1 0 1 2\n" +
    "1 0 0 0\n" +
    "1 3 0 2\n" +
    "0 2 3 2\n" +
    "10 2 1 1\n" +
    "1 1 2 0\n" +
    "1 0 3 2\n" +
    "1 1 3 3\n" +
    "0 3 2 3\n" +
    "0 3 2 3\n" +
    "10 1 3 1\n" +
    "15 1 0 3\n" +
    "1 2 3 2\n" +
    "1 3 0 0\n" +
    "1 3 0 1\n" +
    "3 2 1 0\n" +
    "0 0 3 0\n" +
    "10 0 3 3\n" +
    "15 3 1 2\n" +
    "1 2 1 1\n" +
    "1 0 1 3\n" +
    "0 1 0 0\n" +
    "6 0 3 0\n" +
    "14 0 1 3\n" +
    "0 3 1 3\n" +
    "0 3 2 3\n" +
    "10 2 3 2\n" +
    "15 2 0 1\n" +
    "0 2 0 3\n" +
    "6 3 0 3\n" +
    "1 3 0 2\n" +
    "1 2 1 0\n" +
    "12 0 3 3\n" +
    "0 3 3 3\n" +
    "10 3 1 1\n" +
    "15 1 3 0\n" +
    "0 3 0 3\n" +
    "6 3 0 3\n" +
    "1 1 3 1\n" +
    "0 1 2 2\n" +
    "0 2 1 2\n" +
    "10 0 2 0\n" +
    "15 0 2 2\n" +
    "1 2 0 3\n" +
    "1 2 2 0\n" +
    "5 0 3 1\n" +
    "0 1 3 1\n" +
    "10 1 2 2\n" +
    "15 2 2 1\n" +
    "1 3 2 2\n" +
    "1 3 1 3\n" +
    "2 3 2 0\n" +
    "0 0 1 0\n" +
    "0 0 1 0\n" +
    "10 0 1 1\n" +
    "0 1 0 2\n" +
    "6 2 2 2\n" +
    "1 2 0 3\n" +
    "1 2 0 0\n" +
    "12 2 3 2\n" +
    "0 2 2 2\n" +
    "0 2 1 2\n" +
    "10 2 1 1\n" +
    "15 1 3 3\n" +
    "1 1 1 0\n" +
    "1 3 2 2\n" +
    "1 2 1 1\n" +
    "11 1 2 0\n" +
    "0 0 3 0\n" +
    "10 0 3 3\n" +
    "15 3 2 1\n" +
    "1 2 2 0\n" +
    "1 3 2 3\n" +
    "2 3 2 2\n" +
    "0 2 3 2\n" +
    "0 2 2 2\n" +
    "10 2 1 1\n" +
    "1 0 1 2\n" +
    "1 1 2 3\n" +
    "4 0 3 2\n" +
    "0 2 2 2\n" +
    "10 2 1 1\n" +
    "15 1 3 0\n" +
    "0 2 0 2\n" +
    "6 2 2 2\n" +
    "1 0 2 3\n" +
    "1 0 0 1\n" +
    "7 3 2 3\n" +
    "0 3 1 3\n" +
    "10 3 0 0\n" +
    "1 2 1 3\n" +
    "1 2 3 1\n" +
    "1 1 0 2\n" +
    "12 1 3 2\n" +
    "0 2 1 2\n" +
    "0 2 2 2\n" +
    "10 0 2 0\n" +
    "1 0 0 2\n" +
    "8 2 3 1\n" +
    "0 1 2 1\n" +
    "10 1 0 0\n" +
    "15 0 1 3\n" +
    "1 2 3 2\n" +
    "0 0 0 0\n" +
    "6 0 1 0\n" +
    "1 3 0 1\n" +
    "15 0 2 1\n" +
    "0 1 2 1\n" +
    "10 3 1 3\n" +
    "15 3 2 1\n" +
    "1 2 1 0\n" +
    "1 1 0 2\n" +
    "0 2 0 3\n" +
    "6 3 2 3\n" +
    "5 0 3 2\n" +
    "0 2 2 2\n" +
    "10 2 1 1\n" +
    "15 1 1 0\n" +
    "1 1 2 3\n" +
    "0 0 0 1\n" +
    "6 1 0 1\n" +
    "0 1 0 2\n" +
    "6 2 1 2\n" +
    "10 3 3 2\n" +
    "0 2 1 2\n" +
    "10 0 2 0\n" +
    "15 0 2 2\n" +
    "1 2 3 0\n" +
    "1 2 1 1\n" +
    "1 2 0 3\n" +
    "12 1 3 0\n" +
    "0 0 2 0\n" +
    "10 2 0 2\n" +
    "0 1 0 1\n" +
    "6 1 3 1\n" +
    "1 1 1 3\n" +
    "1 0 0 0\n" +
    "6 3 1 3\n" +
    "0 3 2 3\n" +
    "10 2 3 2\n" +
    "15 2 1 0\n" +
    "1 3 1 2\n" +
    "1 0 1 3\n" +
    "8 3 2 2\n" +
    "0 2 2 2\n" +
    "10 0 2 0\n" +
    "15 0 1 2\n" +
    "1 1 2 1\n" +
    "1 1 0 0\n" +
    "1 1 0 3\n" +
    "10 0 0 0\n" +
    "0 0 2 0\n" +
    "0 0 3 0\n" +
    "10 0 2 2\n" +
    "15 2 0 0\n" +
    "0 0 0 2\n" +
    "6 2 2 2\n" +
    "0 3 0 1\n" +
    "6 1 2 1\n" +
    "10 3 3 3\n" +
    "0 3 1 3\n" +
    "0 3 1 3\n" +
    "10 3 0 0\n" +
    "15 0 0 1\n" +
    "1 3 0 0\n" +
    "1 3 2 3\n" +
    "3 2 0 2\n" +
    "0 2 3 2\n" +
    "10 2 1 1\n" +
    "15 1 1 3\n" +
    "1 1 3 1\n" +
    "1 3 1 2\n" +
    "0 1 2 1\n" +
    "0 1 2 1\n" +
    "10 3 1 3\n" +
    "15 3 2 0";

module.exports = input;