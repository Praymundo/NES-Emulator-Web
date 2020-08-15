import { Bit } from './cpu6502/type/bit';
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

import Emulator from './emulator';
import Bus from './bus';
import CPU, { CPU6502 as cCPU } from './cpu6502';
import RAM, { RAM as cRAM } from './ram';
import Cartridge, { Cartridge as cCartridge } from './cartridge';

export class Debug {
	constructor() {
		this.global = null;
		this.vm = null;
		this.objDebug = {};
	}
	init(global, vm) {
		this.global = global;
		this.vm = vm;
		// Reset address
		Bus.cpuWrite(0xfffc, 0x00);
		Bus.cpuWrite(0xfffd, 0x80);

		this._setupEnv();
		this._setupDebug();
	}
	_setupEnv() {
		const global = this.global;
		const vm = this.vm;
		const Debug = this;
		global.DEBUG = {
			vm,
			Emulator,
			Bus,
			CPU,
			RAM,
			Debug
		};
	}
	_setupDebug() {
		const buildMemory = (pStart, pEnd) => {
			let ramData = { Start: pStart, End: pEnd };
			for (let index = pStart; index <= pEnd; index++) {
				ramData[index] = { byte: 0x00 };
			}
			return ramData;
		};
		this.objDebug = this.vm.DEBUG = {
			ClockCount: 0,
			RAM: buildMemory(0x00, 0x07ff),
			Program: buildMemory(0x800, 0xffff),
			CPUDebug: {
				RegA: ARegister.get(),
				RegX: XRegister.get(),
				RegY: YRegister.get(),
				RegStatus: SRegister.get(),
				StackPointer: SPRegister.addr(),
				PC: PCRegister.get(),
				Fetched: Fetched.get(),
				AddrAbs: AddrAbs.get(),
				AddrRel: AddrRel.get(),
				Opcode: OPCode.get(),
				Cycles: Cycles.get(),
				FLAGS: {
					C: SRegister.getC(),
					Z: SRegister.getZ(),
					I: SRegister.getI(),
					D: SRegister.getD(),
					B: SRegister.getB(),
					U: SRegister.getU(),
					V: SRegister.getV(),
					N: SRegister.getN()
				}
			}
		};
		this._attachNotify();
	}
	_attachNotify() {
		/// This method is need to check for changes without taking too much CPU power.
		const that = this;
		const objDebug = this.objDebug;
		const RAMDebug = objDebug.RAM;
		const PRODebug = objDebug.Program;
		const CPUDebug = objDebug.CPUDebug;
		/// CPU Clock
		const protCPU = cCPU.prototype;
		const _clockCPU = protCPU.clock;
		protCPU.clock = function () {
			objDebug.ClockCount++;
			return _clockCPU.apply(this, arguments);
		};
		const _resetCPU = protCPU.reset;
		protCPU.reset = function () {
			objDebug.ClockCount = 0;
			return _resetCPU.apply(this, arguments);
		};
		/// RAM Write
		const protRAM = cRAM.prototype;
		const _writeRAM = protRAM.write;
		protRAM.write = function (pAddress, pData) {
			const prev = RAMDebug[pAddress].byte;
			if (prev != pData) {
				RAMDebug[pAddress].byte = pData;
			}
			return _writeRAM.apply(this, arguments);
		};
		/// Cartridge Write
		const protCartridge = cCartridge.prototype;
		const _writeCartridge = protCartridge.cpuWrite;
		protCartridge.cpuWrite = function (pAddress, pData) {
			const data = pData & this._Mask;
			if (this.checkCpuWrite(pAddress)) {
				const prev = PRODebug[pAddress].byte;
				if (prev != data) {
					PRODebug[pAddress].byte = data;
				}
			}
			return _writeCartridge.apply(this, arguments);
		};
		/// Bit Write
		const protBit = Bit.prototype;
		protBit._NotifySet = (pData) => {};
		protBit.onNotifySet = function (pFn) {
			this._NotifySet = pFn;
		};
		const _set = protBit.set;
		protBit.set = function (pData) {
			this._NotifySet(pData);
			return _set.apply(this, arguments);
		};
		/// Attach notify
		ARegister.onNotifySet(function (pData) {
			const data = pData & this._Mask;
			if (CPUDebug.RegA != data) {
				CPUDebug.RegA = data;
			}
		});
		XRegister.onNotifySet(function (pData) {
			const data = pData & this._Mask;
			if (CPUDebug.RegX != data) {
				CPUDebug.RegX = data;
			}
		});
		YRegister.onNotifySet(function (pData) {
			const data = pData & this._Mask;
			if (CPUDebug.RegY != data) {
				CPUDebug.RegY = data;
			}
		});
		PCRegister.onNotifySet(function (pData) {
			const data = pData & this._Mask;
			if (CPUDebug.PC != data) {
				CPUDebug.PC = data;
			}
		});
		SPRegister.onNotifySet(function (pData) {
			const data = pData & this._Mask;
			if ((CPUDebug.StackPointer & 0xff) != data) {
				CPUDebug.StackPointer = data | 0x100;
			}
		});
		SRegister.onNotifySet(function (pData) {
			const data = pData & this._Mask;
			if (CPUDebug.RegStatus != data) {
				CPUDebug.RegStatus = data;
				const FLAGS = CPUDebug.FLAGS;
				FLAGS.C = (data & (0x01 << 0)) == 0x01 << 0 ? 0x01 : 0x00;
				FLAGS.Z = (data & (0x01 << 1)) == 0x01 << 1 ? 0x01 : 0x00;
				FLAGS.I = (data & (0x01 << 2)) == 0x01 << 2 ? 0x01 : 0x00;
				FLAGS.D = (data & (0x01 << 3)) == 0x01 << 3 ? 0x01 : 0x00;
				FLAGS.B = (data & (0x01 << 4)) == 0x01 << 4 ? 0x01 : 0x00;
				FLAGS.U = (data & (0x01 << 5)) == 0x01 << 5 ? 0x01 : 0x00;
				FLAGS.V = (data & (0x01 << 6)) == 0x01 << 6 ? 0x01 : 0x00;
				FLAGS.N = (data & (0x01 << 7)) == 0x01 << 7 ? 0x01 : 0x00;
			}
		});
		Fetched.onNotifySet(function (pData) {
			const data = pData & this._Mask;
			if (CPUDebug.Fetched != data) {
				CPUDebug.Fetched = data;
			}
		});
		OPCode.onNotifySet(function (pData) {
			const data = pData & this._Mask;
			if (CPUDebug.Opcode != data) {
				CPUDebug.Opcode = data;
			}
		});
		AddrAbs.onNotifySet(function (pData) {
			const data = pData & this._Mask;
			if (CPUDebug.AddrAbs != data) {
				CPUDebug.AddrAbs = data;
			}
		});
		AddrRel.onNotifySet(function (pData) {
			const data = pData & this._Mask;
			if (CPUDebug.AddrRel != data) {
				CPUDebug.AddrRel = data;
			}
		});
		Cycles.onNotifySet(function (pData) {
			const data = pData & this._Mask;
			if (CPUDebug.Cycles != data) {
				CPUDebug.Cycles = data;
			}
		});
	}
	_readStack(pIndex) {
		var tAddr = ((SPRegister.get() + pIndex) & 0x00ff) | 0x100;
		return {
			addr: tAddr,
			byte: Bus.cpuRead(tAddr)
		};
	}
	_readMem(pAddress, pRows, pColumns) {
		let tMem = [];
		for (let i = 0; i < pRows; i++) {
			let tRow = [{ addr: pAddress, byte: 0x00 }];
			for (let j = 0; j < pColumns; j++) {
				tRow.push({ addr: pAddress, byte: Bus.cpuRead(pAddress) });
				pAddress++;
			}
			tMem.push(tRow);
		}
		return tMem;
	}
	loadProgram(pProgram) {
		const OFFSET = 0x8000;
		if (pProgram == '') {
			pProgram = this._defaultProgram1();
		}
		const lProgram = pProgram
			.replace(/[\r\n]/gi, ' ')
			.replace(/[\s]+/, ' ')
			.split(' ');
		for (let i = 0x00; i <= 0xff; i++) {
			const byte = lProgram[i] ? parseInt(lProgram[i], 16) : 0x00;
			Bus.cpuWrite(OFFSET | i, byte);
		}
		return pProgram;
	}
	_defaultProgram1() {
		// (assembled at https://www.masswerk.at/6502/assembler.html)
		/* Calculate (3 * 10) and store the result (30) at 0x02
        *=$8000
        LDX #10
        STX $0000
        LDX #3
        STX $0001
        LDY $0000
        LDA #0
        CLC
        loop
        ADC $0001
        DEY
        BNE loop
        STA $0002
        NOP
        NOP
        NOP
        end
        JMP end
        NOP
        NOP
        NOP
        */
		return 'A2 0A 8E 00 00 A2 03 8E 01 00 AC 00 00 A9 00 18 6D 01 00 88 D0 FA 8D 02 00 EA EA EA 4C 1C 80 EA EA EA';
	}
	_defaultProgram2() {
		// (assembled at https://www.masswerk.at/6502/assembler.html)
		/* Calculate (3 * 10) and store the result (30) at 0x02, use Break instead of endless loop on the end
        *=$8000
        LDX #<brkrtn
        STX $FFFE
        LDX #>brkrtn
        STX $FFFF
        LDX #10
        STX $0000
        LDX #3
        STX $0001
        LDY $0000
        LDA #0
        loop
        ADC $0001
        DEY
        BNE loop
        STA $0002
        NOP
        end
        BRK
        NOP
        NOP
        JMP end
        brkrtn
        NOP
        RTI
        */
		return 'A2 29 8E FE FF A2 80 8E FF FF A2 0A 8E 00 00 A2 03 8E 01 00 AC 00 00 A9 00 6D 01 00 88 D0 FA 8D 02 00 EA 00 EA EA 4C 23 80 EA 40';
	}
}

export default new Debug();
