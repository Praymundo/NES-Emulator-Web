import { Instruction } from './type/instruction';
import CPU from '../cpu6502';

export class InstructionTable {
	constructor() {
		this._Table = null;
	}
	getInstruction(pByte) {
		this._buildTable();
		var tInfo = this._Table[pByte & 0xff];
		return new Instruction(tInfo[0], tInfo[1], tInfo[2], tInfo[3]);
	}
	_buildTable() {
		if (this._Table) {
			return;
		}
		// http://wiki.nesdev.com/w/index.php/Programming_with_unofficial_opcodes
		// https://www.masswerk.at/6502/6502_instruction_set.html
		// https://github.com/OneLoneCoder/olcNES/blob/1db7fcad56591d22de36300b53da603a7c996125/Part%232%20-%20CPU/olc6502.cpp
		this._Table = { length: 16 * 16 };
		this._Table[0x00] = ['BRK', CPU._BRK, CPU._IMM, 7];
		this._Table[0x01] = ['ORA', CPU._ORA, CPU._IZX, 6];
		this._Table[0x02] = ['???', CPU._XXX, CPU._IMP, 2];
		this._Table[0x03] = ['???', CPU._XXX, CPU._IMP, 8];
		this._Table[0x04] = ['???', CPU._NOP, CPU._IMP, 3];
		this._Table[0x05] = ['ORA', CPU._ORA, CPU._ZP0, 3];
		this._Table[0x06] = ['ASL', CPU._ASL, CPU._ZP0, 5];
		this._Table[0x07] = ['???', CPU._XXX, CPU._IMP, 5];
		this._Table[0x08] = ['PHP', CPU._PHP, CPU._IMP, 3];
		this._Table[0x09] = ['ORA', CPU._ORA, CPU._IMM, 2];
		this._Table[0x0a] = ['ASL', CPU._ASL, CPU._IMP, 2];
		this._Table[0x0b] = ['???', CPU._XXX, CPU._IMP, 2];
		this._Table[0x0c] = ['???', CPU._NOP, CPU._IMP, 4];
		this._Table[0x0d] = ['ORA', CPU._ORA, CPU._ABS, 4];
		this._Table[0x0e] = ['ASL', CPU._ASL, CPU._ABS, 6];
		this._Table[0x0f] = ['???', CPU._XXX, CPU._IMP, 6];
		this._Table[0x10] = ['BPL', CPU._BPL, CPU._REL, 2];
		this._Table[0x11] = ['ORA', CPU._ORA, CPU._IZY, 5];
		this._Table[0x12] = ['???', CPU._XXX, CPU._IMP, 2];
		this._Table[0x13] = ['???', CPU._XXX, CPU._IMP, 8];
		this._Table[0x14] = ['???', CPU._NOP, CPU._IMP, 4];
		this._Table[0x15] = ['ORA', CPU._ORA, CPU._ZPX, 4];
		this._Table[0x16] = ['ASL', CPU._ASL, CPU._ZPX, 6];
		this._Table[0x17] = ['???', CPU._XXX, CPU._IMP, 6];
		this._Table[0x18] = ['CLC', CPU._CLC, CPU._IMP, 2];
		this._Table[0x19] = ['ORA', CPU._ORA, CPU._ABY, 4];
		this._Table[0x1a] = ['???', CPU._NOP, CPU._IMP, 2];
		this._Table[0x1b] = ['???', CPU._XXX, CPU._IMP, 7];
		this._Table[0x1c] = ['???', CPU._NOP, CPU._IMP, 4];
		this._Table[0x1d] = ['ORA', CPU._ORA, CPU._ABX, 4];
		this._Table[0x1e] = ['ASL', CPU._ASL, CPU._ABX, 7];
		this._Table[0x1f] = ['???', CPU._XXX, CPU._IMP, 7];
		this._Table[0x20] = ['JSR', CPU._JSR, CPU._ABS, 6];
		this._Table[0x21] = ['AND', CPU._AND, CPU._IZX, 6];
		this._Table[0x22] = ['???', CPU._XXX, CPU._IMP, 2];
		this._Table[0x23] = ['???', CPU._XXX, CPU._IMP, 8];
		this._Table[0x24] = ['BIT', CPU._BIT, CPU._ZP0, 3];
		this._Table[0x25] = ['AND', CPU._AND, CPU._ZP0, 3];
		this._Table[0x26] = ['ROL', CPU._ROL, CPU._ZP0, 5];
		this._Table[0x27] = ['???', CPU._XXX, CPU._IMP, 5];
		this._Table[0x28] = ['PLP', CPU._PLP, CPU._IMP, 4];
		this._Table[0x29] = ['AND', CPU._AND, CPU._IMM, 2];
		this._Table[0x2a] = ['ROL', CPU._ROL, CPU._IMP, 2];
		this._Table[0x2b] = ['???', CPU._XXX, CPU._IMP, 2];
		this._Table[0x2c] = ['BIT', CPU._BIT, CPU._ABS, 4];
		this._Table[0x2d] = ['AND', CPU._AND, CPU._ABS, 4];
		this._Table[0x2e] = ['ROL', CPU._ROL, CPU._ABS, 6];
		this._Table[0x2f] = ['???', CPU._XXX, CPU._IMP, 6];
		this._Table[0x30] = ['BMI', CPU._BMI, CPU._REL, 2];
		this._Table[0x31] = ['AND', CPU._AND, CPU._IZY, 5];
		this._Table[0x32] = ['???', CPU._XXX, CPU._IMP, 2];
		this._Table[0x33] = ['???', CPU._XXX, CPU._IMP, 8];
		this._Table[0x34] = ['???', CPU._NOP, CPU._IMP, 4];
		this._Table[0x35] = ['AND', CPU._AND, CPU._ZPX, 4];
		this._Table[0x36] = ['ROL', CPU._ROL, CPU._ZPX, 6];
		this._Table[0x37] = ['???', CPU._XXX, CPU._IMP, 6];
		this._Table[0x38] = ['SEC', CPU._SEC, CPU._IMP, 2];
		this._Table[0x39] = ['AND', CPU._AND, CPU._ABY, 4];
		this._Table[0x3a] = ['???', CPU._NOP, CPU._IMP, 2];
		this._Table[0x3b] = ['???', CPU._XXX, CPU._IMP, 7];
		this._Table[0x3c] = ['???', CPU._NOP, CPU._IMP, 4];
		this._Table[0x3d] = ['AND', CPU._AND, CPU._ABX, 4];
		this._Table[0x3e] = ['ROL', CPU._ROL, CPU._ABX, 7];
		this._Table[0x3f] = ['???', CPU._XXX, CPU._IMP, 7];
		this._Table[0x40] = ['RTI', CPU._RTI, CPU._IMP, 6];
		this._Table[0x41] = ['EOR', CPU._EOR, CPU._IZX, 6];
		this._Table[0x42] = ['???', CPU._XXX, CPU._IMP, 2];
		this._Table[0x43] = ['???', CPU._XXX, CPU._IMP, 8];
		this._Table[0x44] = ['???', CPU._NOP, CPU._IMP, 3];
		this._Table[0x45] = ['EOR', CPU._EOR, CPU._ZP0, 3];
		this._Table[0x46] = ['LSR', CPU._LSR, CPU._ZP0, 5];
		this._Table[0x47] = ['???', CPU._XXX, CPU._IMP, 5];
		this._Table[0x48] = ['PHA', CPU._PHA, CPU._IMP, 3];
		this._Table[0x49] = ['EOR', CPU._EOR, CPU._IMM, 2];
		this._Table[0x4a] = ['LSR', CPU._LSR, CPU._IMP, 2];
		this._Table[0x4b] = ['???', CPU._XXX, CPU._IMP, 2];
		this._Table[0x4c] = ['JMP', CPU._JMP, CPU._ABS, 3];
		this._Table[0x4d] = ['EOR', CPU._EOR, CPU._ABS, 4];
		this._Table[0x4e] = ['LSR', CPU._LSR, CPU._ABS, 6];
		this._Table[0x4f] = ['???', CPU._XXX, CPU._IMP, 6];
		this._Table[0x50] = ['BVC', CPU._BVC, CPU._REL, 2];
		this._Table[0x51] = ['EOR', CPU._EOR, CPU._IZY, 5];
		this._Table[0x52] = ['???', CPU._XXX, CPU._IMP, 2];
		this._Table[0x53] = ['???', CPU._XXX, CPU._IMP, 8];
		this._Table[0x54] = ['???', CPU._NOP, CPU._IMP, 4];
		this._Table[0x55] = ['EOR', CPU._EOR, CPU._ZPX, 4];
		this._Table[0x56] = ['LSR', CPU._LSR, CPU._ZPX, 6];
		this._Table[0x57] = ['???', CPU._XXX, CPU._IMP, 6];
		this._Table[0x58] = ['CLI', CPU._CLI, CPU._IMP, 2];
		this._Table[0x59] = ['EOR', CPU._EOR, CPU._ABY, 4];
		this._Table[0x5a] = ['???', CPU._NOP, CPU._IMP, 2];
		this._Table[0x5b] = ['???', CPU._XXX, CPU._IMP, 7];
		this._Table[0x5c] = ['???', CPU._NOP, CPU._IMP, 4];
		this._Table[0x5d] = ['EOR', CPU._EOR, CPU._ABX, 4];
		this._Table[0x5e] = ['LSR', CPU._LSR, CPU._ABX, 7];
		this._Table[0x5f] = ['???', CPU._XXX, CPU._IMP, 7];
		this._Table[0x60] = ['RTS', CPU._RTS, CPU._IMP, 6];
		this._Table[0x61] = ['ADC', CPU._ADC, CPU._IZX, 6];
		this._Table[0x62] = ['???', CPU._XXX, CPU._IMP, 2];
		this._Table[0x63] = ['???', CPU._XXX, CPU._IMP, 8];
		this._Table[0x64] = ['???', CPU._NOP, CPU._IMP, 3];
		this._Table[0x65] = ['ADC', CPU._ADC, CPU._ZP0, 3];
		this._Table[0x66] = ['ROR', CPU._ROR, CPU._ZP0, 5];
		this._Table[0x67] = ['???', CPU._XXX, CPU._IMP, 5];
		this._Table[0x68] = ['PLA', CPU._PLA, CPU._IMP, 4];
		this._Table[0x69] = ['ADC', CPU._ADC, CPU._IMM, 2];
		this._Table[0x6a] = ['ROR', CPU._ROR, CPU._IMP, 2];
		this._Table[0x6b] = ['???', CPU._XXX, CPU._IMP, 2];
		this._Table[0x6c] = ['JMP', CPU._JMP, CPU._IND, 5];
		this._Table[0x6d] = ['ADC', CPU._ADC, CPU._ABS, 4];
		this._Table[0x6e] = ['ROR', CPU._ROR, CPU._ABS, 6];
		this._Table[0x6f] = ['???', CPU._XXX, CPU._IMP, 6];
		this._Table[0x70] = ['BVS', CPU._BVS, CPU._REL, 2];
		this._Table[0x71] = ['ADC', CPU._ADC, CPU._IZY, 5];
		this._Table[0x72] = ['???', CPU._XXX, CPU._IMP, 2];
		this._Table[0x73] = ['???', CPU._XXX, CPU._IMP, 8];
		this._Table[0x74] = ['???', CPU._NOP, CPU._IMP, 4];
		this._Table[0x75] = ['ADC', CPU._ADC, CPU._ZPX, 4];
		this._Table[0x76] = ['ROR', CPU._ROR, CPU._ZPX, 6];
		this._Table[0x77] = ['???', CPU._XXX, CPU._IMP, 6];
		this._Table[0x78] = ['SEI', CPU._SEI, CPU._IMP, 2];
		this._Table[0x79] = ['ADC', CPU._ADC, CPU._ABY, 4];
		this._Table[0x7a] = ['???', CPU._NOP, CPU._IMP, 2];
		this._Table[0x7b] = ['???', CPU._XXX, CPU._IMP, 7];
		this._Table[0x7c] = ['???', CPU._NOP, CPU._IMP, 4];
		this._Table[0x7d] = ['ADC', CPU._ADC, CPU._ABX, 4];
		this._Table[0x7e] = ['ROR', CPU._ROR, CPU._ABX, 7];
		this._Table[0x7f] = ['???', CPU._XXX, CPU._IMP, 7];
		this._Table[0x80] = ['???', CPU._NOP, CPU._IMP, 2];
		this._Table[0x81] = ['STA', CPU._STA, CPU._IZX, 6];
		this._Table[0x82] = ['???', CPU._NOP, CPU._IMP, 2];
		this._Table[0x83] = ['???', CPU._XXX, CPU._IMP, 6];
		this._Table[0x84] = ['STY', CPU._STY, CPU._ZP0, 3];
		this._Table[0x85] = ['STA', CPU._STA, CPU._ZP0, 3];
		this._Table[0x86] = ['STX', CPU._STX, CPU._ZP0, 3];
		this._Table[0x87] = ['???', CPU._XXX, CPU._IMP, 3];
		this._Table[0x88] = ['DEY', CPU._DEY, CPU._IMP, 2];
		this._Table[0x89] = ['???', CPU._NOP, CPU._IMP, 2];
		this._Table[0x8a] = ['TXA', CPU._TXA, CPU._IMP, 2];
		this._Table[0x8b] = ['???', CPU._XXX, CPU._IMP, 2];
		this._Table[0x8c] = ['STY', CPU._STY, CPU._ABS, 4];
		this._Table[0x8d] = ['STA', CPU._STA, CPU._ABS, 4];
		this._Table[0x8e] = ['STX', CPU._STX, CPU._ABS, 4];
		this._Table[0x8f] = ['???', CPU._XXX, CPU._IMP, 4];
		this._Table[0x90] = ['BCC', CPU._BCC, CPU._REL, 2];
		this._Table[0x91] = ['STA', CPU._STA, CPU._IZY, 6];
		this._Table[0x92] = ['???', CPU._XXX, CPU._IMP, 2];
		this._Table[0x93] = ['???', CPU._XXX, CPU._IMP, 6];
		this._Table[0x94] = ['STY', CPU._STY, CPU._ZPX, 4];
		this._Table[0x95] = ['STA', CPU._STA, CPU._ZPX, 4];
		this._Table[0x96] = ['STX', CPU._STX, CPU._ZPY, 4];
		this._Table[0x97] = ['???', CPU._XXX, CPU._IMP, 4];
		this._Table[0x98] = ['TYA', CPU._TYA, CPU._IMP, 2];
		this._Table[0x99] = ['STA', CPU._STA, CPU._ABY, 5];
		this._Table[0x9a] = ['TXS', CPU._TXS, CPU._IMP, 2];
		this._Table[0x9b] = ['???', CPU._XXX, CPU._IMP, 5];
		this._Table[0x9c] = ['???', CPU._NOP, CPU._IMP, 5];
		this._Table[0x9d] = ['STA', CPU._STA, CPU._ABX, 5];
		this._Table[0x9e] = ['???', CPU._XXX, CPU._IMP, 5];
		this._Table[0x9f] = ['???', CPU._XXX, CPU._IMP, 5];
		this._Table[0xa0] = ['LDY', CPU._LDY, CPU._IMM, 2];
		this._Table[0xa1] = ['LDA', CPU._LDA, CPU._IZX, 6];
		this._Table[0xa2] = ['LDX', CPU._LDX, CPU._IMM, 2];
		this._Table[0xa3] = ['???', CPU._XXX, CPU._IMP, 6];
		this._Table[0xa4] = ['LDY', CPU._LDY, CPU._ZP0, 3];
		this._Table[0xa5] = ['LDA', CPU._LDA, CPU._ZP0, 3];
		this._Table[0xa6] = ['LDX', CPU._LDX, CPU._ZP0, 3];
		this._Table[0xa7] = ['???', CPU._XXX, CPU._IMP, 3];
		this._Table[0xa8] = ['TAY', CPU._TAY, CPU._IMP, 2];
		this._Table[0xa9] = ['LDA', CPU._LDA, CPU._IMM, 2];
		this._Table[0xaa] = ['TAX', CPU._TAX, CPU._IMP, 2];
		this._Table[0xab] = ['???', CPU._XXX, CPU._IMP, 2];
		this._Table[0xac] = ['LDY', CPU._LDY, CPU._ABS, 4];
		this._Table[0xad] = ['LDA', CPU._LDA, CPU._ABS, 4];
		this._Table[0xae] = ['LDX', CPU._LDX, CPU._ABS, 4];
		this._Table[0xaf] = ['???', CPU._XXX, CPU._IMP, 4];
		this._Table[0xb0] = ['BCS', CPU._BCS, CPU._REL, 2];
		this._Table[0xb1] = ['LDA', CPU._LDA, CPU._IZY, 5];
		this._Table[0xb2] = ['???', CPU._XXX, CPU._IMP, 2];
		this._Table[0xb3] = ['???', CPU._XXX, CPU._IMP, 5];
		this._Table[0xb4] = ['LDY', CPU._LDY, CPU._ZPX, 4];
		this._Table[0xb5] = ['LDA', CPU._LDA, CPU._ZPX, 4];
		this._Table[0xb6] = ['LDX', CPU._LDX, CPU._ZPY, 4];
		this._Table[0xb7] = ['???', CPU._XXX, CPU._IMP, 4];
		this._Table[0xb8] = ['CLV', CPU._CLV, CPU._IMP, 2];
		this._Table[0xb9] = ['LDA', CPU._LDA, CPU._ABY, 4];
		this._Table[0xba] = ['TSX', CPU._TSX, CPU._IMP, 2];
		this._Table[0xbb] = ['???', CPU._XXX, CPU._IMP, 4];
		this._Table[0xbc] = ['LDY', CPU._LDY, CPU._ABX, 4];
		this._Table[0xbd] = ['LDA', CPU._LDA, CPU._ABX, 4];
		this._Table[0xbe] = ['LDX', CPU._LDX, CPU._ABY, 4];
		this._Table[0xbf] = ['???', CPU._XXX, CPU._IMP, 4];
		this._Table[0xc0] = ['CPY', CPU._CPY, CPU._IMM, 2];
		this._Table[0xc1] = ['CMP', CPU._CMP, CPU._IZX, 6];
		this._Table[0xc2] = ['???', CPU._NOP, CPU._IMP, 2];
		this._Table[0xc3] = ['???', CPU._XXX, CPU._IMP, 8];
		this._Table[0xc4] = ['CPY', CPU._CPY, CPU._ZP0, 3];
		this._Table[0xc5] = ['CMP', CPU._CMP, CPU._ZP0, 3];
		this._Table[0xc6] = ['DEC', CPU._DEC, CPU._ZP0, 5];
		this._Table[0xc7] = ['???', CPU._XXX, CPU._IMP, 5];
		this._Table[0xc8] = ['INY', CPU._INY, CPU._IMP, 2];
		this._Table[0xc9] = ['CMP', CPU._CMP, CPU._IMM, 2];
		this._Table[0xca] = ['DEX', CPU._DEX, CPU._IMP, 2];
		this._Table[0xcb] = ['???', CPU._XXX, CPU._IMP, 2];
		this._Table[0xcc] = ['CPY', CPU._CPY, CPU._ABS, 4];
		this._Table[0xcd] = ['CMP', CPU._CMP, CPU._ABS, 4];
		this._Table[0xce] = ['DEC', CPU._DEC, CPU._ABS, 6];
		this._Table[0xcf] = ['???', CPU._XXX, CPU._IMP, 6];
		this._Table[0xd0] = ['BNE', CPU._BNE, CPU._REL, 2];
		this._Table[0xd1] = ['CMP', CPU._CMP, CPU._IZY, 5];
		this._Table[0xd2] = ['???', CPU._XXX, CPU._IMP, 2];
		this._Table[0xd3] = ['???', CPU._XXX, CPU._IMP, 8];
		this._Table[0xd4] = ['???', CPU._NOP, CPU._IMP, 4];
		this._Table[0xd5] = ['CMP', CPU._CMP, CPU._ZPX, 4];
		this._Table[0xd6] = ['DEC', CPU._DEC, CPU._ZPX, 6];
		this._Table[0xd7] = ['???', CPU._XXX, CPU._IMP, 6];
		this._Table[0xd8] = ['CLD', CPU._CLD, CPU._IMP, 2];
		this._Table[0xd9] = ['CMP', CPU._CMP, CPU._ABY, 4];
		this._Table[0xda] = ['NOP', CPU._NOP, CPU._IMP, 2];
		this._Table[0xdb] = ['???', CPU._XXX, CPU._IMP, 7];
		this._Table[0xdc] = ['???', CPU._NOP, CPU._IMP, 4];
		this._Table[0xdd] = ['CMP', CPU._CMP, CPU._ABX, 4];
		this._Table[0xde] = ['DEC', CPU._DEC, CPU._ABX, 7];
		this._Table[0xdf] = ['???', CPU._XXX, CPU._IMP, 7];
		this._Table[0xe0] = ['CPX', CPU._CPX, CPU._IMM, 2];
		this._Table[0xe1] = ['SBC', CPU._SBC, CPU._IZX, 6];
		this._Table[0xe2] = ['???', CPU._NOP, CPU._IMP, 2];
		this._Table[0xe3] = ['???', CPU._XXX, CPU._IMP, 8];
		this._Table[0xe4] = ['CPX', CPU._CPX, CPU._ZP0, 3];
		this._Table[0xe5] = ['SBC', CPU._SBC, CPU._ZP0, 3];
		this._Table[0xe6] = ['INC', CPU._INC, CPU._ZP0, 5];
		this._Table[0xe7] = ['???', CPU._XXX, CPU._IMP, 5];
		this._Table[0xe8] = ['INX', CPU._INX, CPU._IMP, 2];
		this._Table[0xe9] = ['SBC', CPU._SBC, CPU._IMM, 2];
		this._Table[0xea] = ['NOP', CPU._NOP, CPU._IMP, 2];
		this._Table[0xeb] = ['???', CPU._SBC, CPU._IMP, 2];
		this._Table[0xec] = ['CPX', CPU._CPX, CPU._ABS, 4];
		this._Table[0xed] = ['SBC', CPU._SBC, CPU._ABS, 4];
		this._Table[0xee] = ['INC', CPU._INC, CPU._ABS, 6];
		this._Table[0xef] = ['???', CPU._XXX, CPU._IMP, 6];
		this._Table[0xf0] = ['BEQ', CPU._BEQ, CPU._REL, 2];
		this._Table[0xf1] = ['SBC', CPU._SBC, CPU._IZY, 5];
		this._Table[0xf2] = ['???', CPU._XXX, CPU._IMP, 2];
		this._Table[0xf3] = ['???', CPU._XXX, CPU._IMP, 8];
		this._Table[0xf4] = ['???', CPU._NOP, CPU._IMP, 4];
		this._Table[0xf5] = ['SBC', CPU._SBC, CPU._ZPX, 4];
		this._Table[0xf6] = ['INC', CPU._INC, CPU._ZPX, 6];
		this._Table[0xf7] = ['???', CPU._XXX, CPU._IMP, 6];
		this._Table[0xf8] = ['SED', CPU._SED, CPU._IMP, 2];
		this._Table[0xf9] = ['SBC', CPU._SBC, CPU._ABY, 4];
		this._Table[0xfa] = ['NOP', CPU._NOP, CPU._IMP, 2];
		this._Table[0xfb] = ['???', CPU._XXX, CPU._IMP, 7];
		this._Table[0xfc] = ['???', CPU._NOP, CPU._IMP, 4];
		this._Table[0xfd] = ['SBC', CPU._SBC, CPU._ABX, 4];
		this._Table[0xfe] = ['INC', CPU._INC, CPU._ABX, 7];
		this._Table[0xff] = ['???', CPU._XXX, CPU._IMP, 7];
	}
}

export default new InstructionTable();
