const input = "seti 123 0 4\n" +  //set reg4 to 123
    "bani 4 456 4\n" +  //reg4 = reg4 & 456 (starts at 72)
    "eqri 4 72 4\n" +  //reg4 = reg4 === 72 ? 1 : 0
    "addr 4 3 3\n" +  //reg3 = reg3 + 1 (skip one or zero)
    "seti 0 0 3\n" + //go to instruction 2 if reg4 did not = 72 from above
    "seti 0 6 4\n" +  //zero out reg4
    "bori 4 65536 1\n" + //reg1 = reg4 | 65536 (starts at just 65536)
    "seti 678134 1 4\n" + //set reg4 to 678134
    "bani 1 255 5\n" + //reg5 = reg1 & 255 (starts zeroing it out)
    "addr 4 5 4\n" +  //add reg4 and reg5
    "bani 4 16777215 4\n" + //reg4 & 16777215 (lots of ones)
    "muli 4 65899 4\n" +
    "bani 4 16777215 4\n" +
    "gtir 256 1 5\n" +
    "addr 5 3 3\n" +
    "addi 3 1 3\n" +
    "seti 27 8 3\n" +  //jump to instruction 28
    "seti 0 1 5\n" +
    "addi 5 1 2\n" +
    "muli 2 256 2\n" +
    "gtrr 2 1 2\n" +
    "addr 2 3 3\n" +
    "addi 3 1 3\n" +
    "seti 25 7 3\n" +
    "addi 5 1 5\n" +
    "seti 17 1 3\n" +
    "setr 5 3 1\n" +
    "seti 7 8 3\n" +
    "eqrr 4 0 5\n" + //set reg5 to 1 if reg4 = reg0
    "addr 5 3 3\n" + //(end if above statement was true
    "seti 5 4 3"; //Jump to instruction 6

module.exports = input.split('\n');