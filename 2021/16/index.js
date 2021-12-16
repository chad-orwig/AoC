import { input } from "./input.js";

class Packet {
    /**
     * @typedef {'literal' | 'operator'} PacketType
     * @typedef {'sum' | 'product' | 'min' | 'max' | 'gt' | 'lt' | 'eq' } OperatorType
     * @type {Map<number, OperatorType>}
     */
    static #typeIdMap = new Map([
        [0, 'sum'],
        [1, 'product'],
        [2, 'min'],
        [3, 'max'],
        [5, 'gt'],
        [6, 'lt'],
        [7, 'eq'],
    ]);

    /**
     * 
     * @param {number} typeId 
     */
    static getType(typeId) {
        return typeId === 4 ? 'literal' : 'operator';
    }

    /**
     * 
     * @param {string} str
     * @returns {{ packet: Packet, remaining: string}}
     */
    static readBinary(str) {
        const version = parseInt(str.slice(0, 3), 2);
        const typeId  = parseInt(str.slice(3, 6), 2);
        const type = Packet.getType(typeId);
        let packet;
        let remaining;
        switch(type) {
            case 'literal':
                const literalAns = LiteralPacket.readValue(str.slice(6));
                remaining = literalAns.remaining;
                packet = new LiteralPacket(version, literalAns.value);
                break;
            case 'operator':
                const operatorAns = OperatorPacket.readPackets(str.slice(6));
                switch(Packet.#typeIdMap.get(typeId)) {
                    case 'sum':
                        packet = new SumPacket(version, operatorAns.packets);
                        break;
                    case 'product':
                        packet = new ProductPacket(version, operatorAns.packets);
                        break;
                    case 'min':
                        packet = new MinPacket(version, operatorAns.packets);
                        break;
                    case 'max':
                        packet = new MaxPacket(version, operatorAns.packets);
                        break;
                    case 'gt':
                        packet = new GTPacket(version, operatorAns.packets);
                        break;
                    case 'lt':
                        packet = new LTPacket(version, operatorAns.packets);
                        break;
                    case 'eq':
                        packet = new EQPacket(version, operatorAns.packets);
                        break;
                    default:
                        throw new Error(`unknown packet type ${typeId}`);
                }
                
                remaining = operatorAns.remaining;
                break;
        }
        return { packet, remaining}
    }
    /**
     * 
     * @param {number} version 
     * @param {PacketType} type 
     */
    constructor(version, type) {
        this.type = type;
        this.version = version;
    }

    get calculatedValue() {
        return 0;
    }
}

class LiteralPacket extends Packet {
    /**
     * 
     * @param {number} version 
     * @param {number} value 
     */
    constructor(version, value) {
        super(version, 'literal');
        this.value = value;
    }

    /**
     * 
     * @param {string} str 
     * @returns {{ value: number, remaining: string}}
     */
    static readValue(str) {
        let c = true;
        let halfBytes = [];
        for(let i = 0; c; i++) {
            const start = i * 5;
            const prefix = str.slice(start, 1 + start);
            c = prefix === '1';
            halfBytes.push(str.slice(start + 1, start + 5));
        }
        const value = parseInt(halfBytes.join(''), 2);
        const valueSize = halfBytes.length * 5;
        const remaining = str.slice(valueSize);
        return { value, remaining };
    }

    get calculatedValue() {
        return this.value;
    }
}

class OperatorPacket extends Packet {
    /**
     * 
     * @param {number} version 
     * @param {Packet[]} packets 
     */
    constructor(version, packets) {
        super(version, 'operator');
        this.packets = packets;
    }

    /**
     * 
     * @param {string} str 
     * @returns {{ packets: Packet[], remaining: str }}
     */
    static readPackets(str) {
        const lengthTypeId = str.slice(0, 1);
        return lengthTypeId === '1' ? OperatorPacket.#readLengthType1(str.slice(1)) : OperatorPacket.#readLengthType0(str.slice(1));
    }

    /**
     * 
     * @param {string} str 
     * @returns {{ packets: Packet[], remaining: str }}
     */
    static #readLengthType0(str) {
        const subPacketLength = parseInt(str.slice(0, 15), 2);
        let myPacketsStr = str.slice(15, 15 + subPacketLength);
        const remaining = str.slice(15 + subPacketLength);
        
        const packets = [];
        while(myPacketsStr) {
            const ans = Packet.readBinary(myPacketsStr);
            packets.push(ans.packet);
            myPacketsStr = ans.remaining;
        }
        return { packets, remaining };
    }
    /**
     * 
     * @param {string} str 
     * @returns {{ packets: Packet[], remaining: str }}
     */
    static #readLengthType1(str) {
        const numPackets = parseInt(str.slice(0, 11), 2);
        const packets = [];
        let remaining = str.slice(11);

        for(let i = 0; i < numPackets; i++) {
            const ans = Packet.readBinary(remaining);
            packets.push(ans.packet);
            remaining = ans.remaining;
        }

        return { packets, remaining };
    }

    addVersions() {
        return this.packets
            .map(p => p instanceof OperatorPacket ? p.addVersions() : p.version)
            .reduce((a,b) => a + b) + this.version;
    }
}

class SumPacket extends OperatorPacket {
    get calculatedValue() {
        return this.packets.map(p => p.calculatedValue)
            .reduce((a,b) => a + b, 0);
    }
}
class ProductPacket extends OperatorPacket {
    get calculatedValue() {
        return this.packets.map(p => p.calculatedValue)
            .reduce((a,b) => a * b, 1);
    }
}

class MinPacket extends OperatorPacket {
    get calculatedValue() {
        return Math.min(...this.packets.map(p => p.calculatedValue));
    }
}

class MaxPacket extends OperatorPacket {
    get calculatedValue() {
        return Math.max(...this.packets.map(p => p.calculatedValue))
    }
}

class GTPacket extends OperatorPacket {
    get calculatedValue() {
        return this.packets[0].calculatedValue > this.packets[1].calculatedValue ? 1 : 0;
    }
}

class LTPacket extends OperatorPacket {
    get calculatedValue() {
        return this.packets[0].calculatedValue < this.packets[1].calculatedValue ? 1 : 0;
    }
}

class EQPacket extends OperatorPacket {
    get calculatedValue() {
        return this.packets[0].calculatedValue === this.packets[1].calculatedValue ? 1 : 0;
    }
}

const binary = BigInt('0x' + input).toString(2);

const { packet: headPacket, remaining } = Packet.readBinary(binary);

console.log(headPacket.addVersions());

console.log(headPacket.calculatedValue);
