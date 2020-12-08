const acc = (bootCode) => (arg) => bootCode.setAccumulator(bootCode.getAccumulator() + arg) && bootCode.jmp(1);
const jmp = (bootCode) => (arg) => bootCode.setIndex(bootCode.getIndex() + arg);
const nop = (bootCode) => () => bootCode.jmp(1);

const executeInstruction = (bootCode) => (operations)=> () => {
    const { operation, arg } = operations[bootCode.getIndex()];
    bootCode[operation](arg);
}


export default function BootCode(accumlator = 0, index = 0) {
    let _accumlator = accumlator;
    let _index = index;

    this.getAccumulator = () => _accumlator;
    this.setAccumulator = (accumlator) => _accumlator = accumlator;

    this.getIndex = () => _index;
    this.setIndex = (index) => _index = index;

    this.acc = acc(this);
    this.jmp = jmp(this);
    this.nop = nop(this);

    this.executionContext = executeInstruction(this);
}