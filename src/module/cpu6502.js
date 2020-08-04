import Bus from './bus';
import ARegister from './cpu6502/_ARegister';
import XRegister from './cpu6502/_XRegister';
import YRegister from './cpu6502/_YRegister';
import PCRegister from './cpu6502/_PCRegister';
import SPRegister from './cpu6502/_SPRegister';
import SRegister from './cpu6502/_SRegister';
import Fetched from './cpu6502/_Fetched';
import OPCode from './cpu6502/_OPCode';
import AddrAbs from './cpu6502/_AddrAbs';
import AddrRel from './cpu6502/_AddrRel';
import Cycles from './cpu6502/_Cycles';
import InstructionTable from './cpu6502/_InstructionTable';

export class CPU6502 {
	constructor() {}
	clock() {
		if (Cycles.get() == 0x00) {
			OPCode.set(this._read(PCRegister.get()));
			PCRegister.inc();
			const _Instruction = InstructionTable.getInstruction(OPCode.get());
			Cycles.set(_Instruction.Cycles);
			const addCycle1 = _Instruction.AddrMode();
			const addCycle2 = _Instruction.Operation();
			if (addCycle1 & addCycle2) {
				Cycles.inc();
			}
		}
		Cycles.dec();
	}
	reset() {
		// src: http://wiki.nesdev.com/w/index.php/Init_code
		const lo = this._read(0xfffc);
		const hi = this._read(0xfffc + 0x01);
		PCRegister.set((hi << 8) | lo);
		ARegister.set(0x00);
		XRegister.set(0x00);
		YRegister.set(0x00);
		SPRegister.set(0xff);
		SRegister.set(0x00);
		SRegister.setU(0x01);
		AddrAbs.set(0x0000);
		AddrRel.set(0x0000);
		Fetched.set(0x00);
		Cycles.set(8);
		for (let index = 0x00; index <= 0xff; index++) {
			this._write(index | 0x0000, 0x00);
			this._write(index | 0x0100, 0x00);
			this._write(index | 0x0200, 0x00);
			this._write(index | 0x0300, 0x00);
			this._write(index | 0x0400, 0x00);
			this._write(index | 0x0500, 0x00);
			this._write(index | 0x0600, 0x00);
			this._write(index | 0x0700, 0x00);
		}
	}
	irq() {
		if (!SRegister.getI()) {
			this._write(SPRegister.addr(), (PCRegister.get() >> 8) & 0x00ff);
			SPRegister.dec();
			this._write(SPRegister.addr(), PCRegister.get() & 0x00ff);
			SPRegister.dec();
			SRegister.setB(0x00);
			SRegister.setU(0x01);
			SRegister.setI(0x01);
			this._write(SPRegister.addr(), SRegister.get());
			SPRegister.dec();
			AddrAbs.set(0xfffe);
			const lo = this._read(AddrAbs.get() + 0x00);
			const hi = this._read(AddrAbs.get() + 0x01);
			PCRegister.set((hi << 8) | lo);
			Cycles.set(7);
		}
	}
	nmi() {
		this._write(SPRegister.addr(), (PCRegister.get() >> 8) & 0x00ff);
		SPRegister.dec();
		this._write(SPRegister.addr(), PCRegister.get() & 0x00ff);
		SPRegister.dec();
		SRegister.setB(0x00);
		SRegister.setU(0x01);
		SRegister.setI(0x01);
		this._write(SPRegister.addr(), SRegister.get());
		SPRegister.dec();
		AddrAbs.set(0xfffa);
		const lo = this._read(AddrAbs.get() + 0x00);
		const hi = this._read(AddrAbs.get() + 0x01);
		PCRegister.set((hi << 8) | lo);
		Cycles.set(8);
	}
	_fetch() {
		const _Instruction = InstructionTable.getInstruction(OPCode.get());
		if (!_Instruction.AddrModeIsA(this._IMP)) {
			Fetched.set(this._read(AddrAbs.get()));
		}
		return Fetched.get();
	}
	_read(pAddress) {
		return Bus.cpuRead(pAddress);
	}
	_write(pAddress, pData) {
		Bus.cpuWrite(pAddress, pData);
	}
	//#region Addressing mode
	_IMP() {
		Fetched.set(ARegister.get());
		return 0;
	}
	_IMM() {
		AddrAbs.set(PCRegister.get());
		PCRegister.inc();
		return;
	}
	_ZP0() {
		AddrAbs.set(this._read(PCRegister.get()));
		PCRegister.inc();
		AddrAbs.set(AddrAbs.get() & 0x00ff);
		return 0;
	}
	_ZPX() {
		AddrAbs.set(this._read(PCRegister.get()) + XRegister.get());
		PCRegister.inc();
		AddrAbs.set(AddrAbs.get() & 0x00ff);
		return 0;
	}
	_ZPY() {
		AddrAbs.set(this._read(PCRegister.get()) + YRegister.get());
		PCRegister.inc();
		AddrAbs.set(AddrAbs.get() & 0x00ff);
		return 0;
	}
	_REL() {
		AddrRel.set(this._read(PCRegister.get()));
		PCRegister.inc();
		// Check if we have a negative value
		if (AddrRel.get() & 0x80) {
			AddrRel.set(AddrRel.get() | 0xff00);
		}
		return 0;
	}
	_ABS() {
		const lo = this._read(PCRegister.get());
		PCRegister.inc();
		const hi = this._read(PCRegister.get());
		PCRegister.inc();
		AddrAbs.set((hi << 8) | lo);
		return 0;
	}
	_ABX() {
		const lo = this._read(PCRegister.get());
		PCRegister.inc();
		const hi = this._read(PCRegister.get());
		PCRegister.inc();
		AddrAbs.set((hi << 8) | lo);
		AddrAbs.set(AddrAbs.get() + XRegister.get());
		// Check if we change memory page
		if ((AddrAbs.get() & 0xff00) != hi << 8) {
			return 1;
		}
		return 0;
	}
	_ABY() {
		const lo = this._read(PCRegister.get());
		PCRegister.inc();
		const hi = this._read(PCRegister.get());
		PCRegister.inc();
		AddrAbs.set((hi << 8) | lo);
		AddrAbs.set(AddrAbs.get() + YRegister.get());
		// Check if we change memory page
		if ((AddrAbs.get() & 0xff00) != hi << 8) {
			return 1;
		}
		return 0;
	}
	_IND() {
		const ptr_lo = this._read(PCRegister.get());
		PCRegister.inc();
		const ptr_hi = this._read(PCRegister.get());
		PCRegister.inc();
		const ptr = (ptr_hi << 8) | ptr_lo;
		const lo = this._read(ptr + 0x00);
		// Hardware Bug (Simulate page boundary)
		if (ptr_lo == 0x00ff) {
			let hi = this._read(ptr + 0x01);
		} else {
			let hi = this._read(ptr & 0xff00);
		}
		AddrAbs.set((hi << 8) | lo);
		return 0;
	}
	_IZX() {
		const t = this._read(PCRegister.get());
		PCRegister.inc();
		const lo = this._read((t + XRegister.get()) & 0x00ff);
		const hi = this._read((t + XRegister.get() + 1) & 0x00ff);
		AddrAbs.set((hi << 8) | lo);
		return 0;
	}
	_IZY() {
		const t = this._read(PCRegister.get());
		PCRegister.inc();
		const lo = this._read(t & 0x00ff);
		const hi = this._read((t + 1) & 0x00ff);
		AddrAbs.set((hi << 8) | lo);
		AddrAbs.set(AddrAbs.get() + YRegister.get());
		if ((AddrAbs.get() & 0xff00) != hi << 8) {
			return 1;
		}
		return 0;
	}
	//#endregion
	//#region OPCode
	_ADC() {
		this._fetch();
		const temp = ARegister.get() + Fetched.get() + SRegister.getC();
		SRegister.setC(temp > 0xff ? 0x01 : 0x00);
		SRegister.setZ((temp & 0x00ff) == 0x00 ? 0x01 : 0x00);
		SRegister.setN(temp & 0x80 ? 0x01 : 0x00);
		SRegister.setV(~(ARegister.get() ^ Fetched.get()) & (ARegister.get() ^ temp) & 0x0080 ? 0x01 : 0x00);
		ARegister.set(temp & 0x00ff);
		return 1;
	}
	_AND() {
		this._fetch();
		ARegister.set(ARegister.get() & Fetched.get());
		SRegister.setZ(ARegister.get() == 0x00 ? 0x01 : 0x00);
		SRegister.setN(ARegister.get() & 0x80 ? 0x01 : 0x00);
		return 1;
	}
	_ASL() {
		this._fetch();
		const temp = Fetched.get() << 1;
		SRegister.setC((temp & 0xff00) > 0 ? 0x01 : 0x00);
		SRegister.setZ((temp & 0x00ff) == 0 ? 0x01 : 0x00);
		SRegister.setN(temp & 0x80 ? 0x01 : 0x00);
		const _Instruction = InstructionTable.getInstruction(OPCode.get());
		if (_Instruction.AddrModeIsA(this._IMP)) {
			ARegister.set(temp & 0x00ff);
		} else {
			this._write(AddrAbs.get(), temp & 0x00ff);
		}
		return 0;
	}
	_BCC() {
		if (!SRegister.getC()) {
			Cycles.inc();
			AddrAbs.set(PCRegister.get() + AddrRel.get());
			if ((AddrAbs.get() & 0xff00) != (PCRegister.get() & 0xff00)) {
				Cycles.inc();
			}
			PCRegister.set(AddrAbs.get());
		}
		return 0;
	}
	_BCS() {
		if (SRegister.getC()) {
			Cycles.inc();
			AddrAbs.set(PCRegister.get() + AddrRel.get());
			if ((AddrAbs.get() & 0xff00) != (PCRegister.get() & 0xff00)) {
				Cycles.inc();
			}
			PCRegister.set(AddrAbs.get());
		}
		return 0;
	}
	_BEQ() {
		if (SRegister.getZ()) {
			Cycles.inc();
			AddrAbs.set(PCRegister.get() + AddrRel.get());
			if ((AddrAbs.get() & 0xff00) != (PCRegister.get() & 0xff00)) {
				Cycles.inc();
			}
			PCRegister.set(AddrAbs.get());
		}
		return 0;
	}
	_BIT() {
		this._fetch();
		const temp = ARegister.get() & Fetched.get();
		SRegister.setZ((temp & 0x00ff) == 0 ? 0x01 : 0x00);
		SRegister.setN(Fetched.get() & (1 << 7) ? 0x01 : 0x00);
		SRegister.setV(Fetched.get() & (1 << 6) ? 0x01 : 0x00);
		return 0;
	}
	_BMI() {
		if (SRegister.getN()) {
			Cycles.inc();
			AddrAbs.set(PCRegister.get() + AddrRel.get());
			if ((AddrAbs.get() & 0xff00) != (PCRegister.get() & 0xff00)) {
				Cycles.inc();
			}
			PCRegister.set(AddrAbs.get());
		}
		return 0;
	}
	_BNE() {
		if (!SRegister.getZ()) {
			Cycles.inc();
			AddrAbs.set(PCRegister.get() + AddrRel.get());
			if ((AddrAbs.get() & 0xff00) != (PCRegister.get() & 0xff00)) {
				Cycles.inc();
			}
			PCRegister.set(AddrAbs.get());
		}
		return 0;
	}
	_BPL() {
		if (!SRegister.getN()) {
			Cycles.inc();
			AddrAbs.set(PCRegister.get() + AddrRel.get());
			if ((AddrAbs.get() & 0xff00) != (PCRegister.get() & 0xff00)) {
				Cycles.inc();
			}
			PCRegister.set(AddrAbs.get());
		}
		return 0;
	}
	_BRK() {
		PCRegister.inc();
		SRegister.setI(0x01);
		this._write(SPRegister.addr(), (PCRegister.get() >> 8) & 0x00ff);
		SPRegister.dec();
		this._write(SPRegister.addr(), PCRegister.get() & 0x00ff);
		SPRegister.dec();
		SRegister.setB(0x01);
		this._write(SPRegister.addr(), SRegister.get());
		SPRegister.dec();
		SRegister.setB(0x00);
		AddrAbs.set(0xfffe);
		const lo = this._read(AddrAbs.get() + 0x00);
		const hi = this._read(AddrAbs.get() + 0x01);
		PCRegister.set((hi << 8) | lo);
		return 0;
	}
	_BVC() {
		if (!SRegister.getV()) {
			Cycles.inc();
			AddrAbs.set(PCRegister.get() + AddrRel.get());
			if ((AddrAbs.get() & 0xff00) != (PCRegister.get() & 0xff00)) {
				Cycles.inc();
			}
			PCRegister.set(AddrAbs.get());
		}
		return 0;
	}
	_BVS() {
		if (SRegister.getV()) {
			Cycles.inc();
			AddrAbs.set(PCRegister.get() + AddrRel.get());
			if ((AddrAbs.get() & 0xff00) != (PCRegister.get() & 0xff00)) {
				Cycles.inc();
			}
			PCRegister.set(AddrAbs.get());
		}
		return 0;
	}
	_CLC() {
		SRegister.setC(0x00);
		return 0;
	}
	_CLD() {
		SRegister.setD(0x00);
		return 0;
	}
	_CLI() {
		SRegister.setI(0x00);
		return 0;
	}
	_CLV() {
		SRegister.setV(0x00);
		return 0;
	}
	_CMP() {
		this._fetch();
		const temp = ARegister.get() - Fetched.get();
		SRegister.setC(ARegister.get() >= Fetched.get());
		SRegister.setZ((temp & 0x00ff) == 0x00 ? 0x01 : 0x00);
		SRegister.setN(temp & 0x80 ? 0x01 : 0x00);
		return 1;
	}
	_CPX() {
		this._fetch();
		const temp = XRegister.get() - Fetched.get();
		SRegister.setC(XRegister.get() >= Fetched.get());
		SRegister.setZ((temp & 0x00ff) == 0x00 ? 0x01 : 0x00);
		SRegister.setN(temp & 0x80 ? 0x01 : 0x00);
		return 0;
	}
	_CPY() {
		this._fetch();
		const temp = YRegister.get() - Fetched.get();
		SRegister.setC(YRegister.get() >= Fetched.get());
		SRegister.setZ((temp & 0x00ff) == 0x00 ? 0x01 : 0x00);
		SRegister.setN(temp & 0x80 ? 0x01 : 0x00);
		return 0;
	}
	_DEC() {
		this._fetch();
		const temp = Fetched.get() - 0x01;
		this._write(AddrAbs.get(), temp & 0x00ff);
		SRegister.setZ((temp & 0x00ff) == 0x00 ? 0x01 : 0x00);
		SRegister.setN(temp & 0x80 ? 0x01 : 0x00);
		return 0;
	}
	_DEX() {
		XRegister.dec();
		SRegister.setZ(XRegister.get() == 0x00 ? 0x01 : 0x00);
		SRegister.setN(XRegister.get() & 0x80 ? 0x01 : 0x00);
		return 0;
	}
	_DEY() {
		YRegister.dec();
		SRegister.setZ(YRegister.get() == 0x00 ? 0x01 : 0x00);
		SRegister.setN(YRegister.get() & 0x80 ? 0x01 : 0x00);
		return 0;
	}
	_EOR() {
		this._fetch();
		ARegister.set(ARegister.get() ^ Fetched.get());
		SRegister.setZ(ARegister.get() == 0x00 ? 0x01 : 0x00);
		SRegister.setN(ARegister.get() & 0x80 ? 0x01 : 0x00);
		return 1;
	}
	_INC() {
		this._fetch();
		const temp = Fetched.get() + 1;
		this._write(AddrAbs.get(), temp & 0x00ff);
		SRegister.setZ((temp & 0x00ff) == 0x00 ? 0x01 : 0x00);
		SRegister.setN(temp & 0x80 ? 0x01 : 0x00);
		return 0;
	}
	_INX() {
		XRegister.inc();
		SRegister.setZ(XRegister.get() == 0x00 ? 0x01 : 0x00);
		SRegister.setN(XRegister.get() & 0x80 ? 0x01 : 0x00);
		return 0;
	}
	_INY() {
		YRegister.inc();
		SRegister.setZ(YRegister.get() == 0x00 ? 0x01 : 0x00);
		SRegister.setN(YRegister.get() & 0x80 ? 0x01 : 0x00);
	}
	_JMP() {
		PCRegister.set(AddrAbs.get());
		return 0;
	}
	_JSR() {
		PCRegister.dec();
		this._write(SPRegister.addr(), (PCRegister.get() >> 8) & 0x00ff);
		SPRegister.dec();
		this._write(SPRegister.addr(), PCRegister.get() & 0x00ff);
		SPRegister.dec();
		PCRegister.set(AddrAbs.get());
		return 0;
	}
	_LDA() {
		this._fetch();
		ARegister.set(Fetched.get());
		SRegister.setZ(ARegister.get() == 0x00 ? 0x01 : 0x00);
		SRegister.setN(ARegister.get() & 0x80 ? 0x01 : 0x00);
		return 1;
	}
	_LDX() {
		this._fetch();
		XRegister.set(Fetched.get());
		SRegister.setZ(XRegister.get() == 0x00 ? 0x01 : 0x00);
		SRegister.setN(XRegister.get() & 0x80 ? 0x01 : 0x00);
		return 1;
	}
	_LDY() {
		this._fetch();
		YRegister.set(Fetched.get());
		SRegister.setZ(YRegister.get() == 0x00 ? 0x01 : 0x00);
		SRegister.setN(YRegister.get() & 0x80 ? 0x01 : 0x00);
		return 1;
	}
	_LSR() {
		this._fetch();
		const temp = Fetched.get() >> 1;
		SRegister.setC(Fetched.get() & 0x01 ? 0x01 : 0x00);
		SRegister.setZ((temp & 0x00ff) == 0x00 ? 0x01 : 0x00);
		SRegister.setN(temp & 0x80 ? 0x01 : 0x00);
		const _Instruction = InstructionTable.getInstruction(OPCode.get());
		if (_Instruction.AddrModeIsA(this._IMP)) {
			ARegister.set(temp & 0x00ff);
		} else {
			this._write(AddrAbs.get(), temp & 0x00ff);
		}
		return 0;
	}
	_NOP() {
		switch (OPCode.get()) {
			case 0x1c:
			case 0x3c:
			case 0x5c:
			case 0x7c:
			case 0xdc:
			case 0xfc: {
				return 1;
				break;
			}
			default: {
				break;
			}
		}
		return 0;
	}
	_ORA() {
		this._fetch();
		ARegister.set(ARegister.get() | Fetched.get());
		SRegister.setZ(ARegister.get() == 0x00 ? 0x01 : 0x00);
		SRegister.setN(ARegister.get() & 0x80 ? 0x01 : 0x00);
		return 1;
	}
	_PHA() {
		this._write(SPRegister.addr(), ARegister.get());
		SPRegister.dec();
		return 0;
	}
	_PHP() {
		const temp = SRegister.get();
		SRegister.setB(0x01);
		SRegister.setU(0x01);
		this._write(SPRegister.addr(), SRegister.get());
		SRegister.set(temp);
		SRegister.setB(0x00);
		SRegister.setU(0x00);
		SPRegister.dec();
		return 0;
	}
	_PLA() {
		SPRegister.inc();
		ARegister.set(this._read(SPRegister.addr()));
		SRegister.setZ(ARegister.get() == 0x00 ? 0x01 : 0x00);
		SRegister.setC(ARegister.get() & 0x80 ? 0x01 : 0x00);
		return 0;
	}
	_PLP() {
		SPRegister.inc();
		SRegister.set(this._read(SPRegister.addr()));
		SRegister.setU(0x01);
		return 0;
	}
	_ROL() {
		this._fetch();
		const temp = (Fetched.get() << 1) | SRegister.getC();
		SRegister.setC(temp & 0xff00 ? 0x01 : 0x00);
		SRegister.setZ((temp & 0x00ff) == 0x00 ? 0x01 : 0x00);
		SRegister.setN(temp & 0x0080 ? 0x01 : 0x00);
		const _Instruction = InstructionTable.getInstruction(OPCode.get());
		if (_Instruction.AddrModeIsA(this._IMP)) {
			ARegister.set(temp & 0x00ff);
		} else {
			this._write(AddrAbs.get(), temp & 0x00ff);
		}
		return 0;
	}
	_ROR() {
		this._fetch();
		const temp = (SRegister.getC() << 7) | (Fetched.get() >> 1);
		SRegister.setC(Fetched.get() & 0x01 ? 0x01 : 0x00);
		SRegister.setZ((temp & 0x00ff) == 0x00 ? 0x01 : 0x00);
		SRegister.setN(temp & 0x0080 ? 0x01 : 0x00);
		const _Instruction = InstructionTable.getInstruction(OPCode.get());
		if (_Instruction.AddrModeIsA(this._IMP)) {
			ARegister.set(temp & 0x00ff);
		} else {
			this._write(AddrAbs.get(), temp & 0x00ff);
		}
		return 0;
	}
	_RTI() {
		SPRegister.inc();
		SRegister.set(this._read(SPRegister.addr()));
		SRegister.setB(0x00);
		SRegister.setU(0x00);
		SPRegister.inc();
		const lo = this._read(SPRegister.addr());
		SPRegister.inc();
		const hi = this._read(SPRegister.addr());
		PCRegister.set((hi << 8) | lo);
		return 0;
	}
	_RTS() {
		SPRegister.inc();
		const lo = this._read(SPRegister.addr());
		SPRegister.inc();
		const hi = this._read(SPRegister.addr());
		PCRegister.set((hi << 8) | lo);
		PCRegister.inc();
		return 0;
	}
	_SBC() {
		this._fetch();
		const value = Fetched.get() ^ 0x00ff;
		const temp = a + value + SRegister.getC();
		SRegister.setC(temp & 0xff00 ? 0x01 : 0x00);
		SRegister.setZ((temp & 0x00ff) == 0x00 ? 0x01 : 0x00);
		SRegister.setN(temp & 0x0080 ? 0x01 : 0x00);
		SRegister.setV((temp ^ a) & (temp ^ value) & 0x0080 ? 0x01 : 0x00);
		a = temp & 0x00ff;
		return 1;
	}
	_SEC() {
		SRegister.setC(0x01);
		return 0;
	}
	_SED() {
		SRegister.setD(0x01);
		return 0;
	}
	_SEI() {
		SRegister.setI(0x01);
		return 0;
	}
	_STA() {
		this._write(AddrAbs.get(), ARegister.get());
		return 0;
	}
	_STX() {
		this._write(AddrAbs.get(), XRegister.get());
		return 0;
	}
	_STY() {
		this._write(AddrAbs.get(), YRegister.get());
		return 0;
	}
	_TAX() {
		XRegister.set(ARegister.get());
		SRegister.setZ(XRegister.get() == 0x00 ? 0x01 : 0x00);
		SRegister.setN(XRegister.get() & 0x80 ? 0x01 : 0x00);
		return 0;
	}
	_TAY() {
		YRegister.set(ARegister.get());
		SRegister.setZ(YRegister.get() == 0x00 ? 0x01 : 0x00);
		SRegister.setN(YRegister.get() & 0x80 ? 0x01 : 0x00);
		return 0;
	}
	_TSX() {
		XRegister.set(SPRegister.get());
		SRegister.setZ(XRegister.get() == 0x00 ? 0x01 : 0x00);
		SRegister.setN(XRegister.get() & 0x80 ? 0x01 : 0x00);
		return 0;
	}
	_TXA() {
		ARegister.set(XRegister.get());
		SRegister.setZ(ARegister.get() == 0x00 ? 0x01 : 0x00);
		SRegister.setN(ARegister.get() & 0x80 ? 0x01 : 0x00);
		return 0;
	}
	_TXS() {
		SPRegister.set(XRegister.get());
		SRegister.setZ(SPRegister.get() == 0x00 ? 0x01 : 0x00);
		SRegister.setN(SPRegister.get() & 0x80 ? 0x01 : 0x00);
		return 0;
	}
	_TYA() {
		ARegister.set(YRegister.get());
		SRegister.setZ(ARegister.get() == 0x00 ? 0x01 : 0x00);
		SRegister.setN(ARegister.get() & 0x80 ? 0x01 : 0x00);
		return 0;
	}
	_XXX() {
		return 0;
	}
	//#endregion
}

export default new CPU6502();
