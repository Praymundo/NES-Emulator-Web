import { Int8Register } from './type/int8Register';

export const SFlags = Object.freeze({
	C: 0x01 << 0, // Carry Bit
	Z: 0x01 << 1, // Zero
	I: 0x01 << 2, // Disable Interrupts
	D: 0x01 << 3, // Decimal Mode
	B: 0x01 << 4, // Break
	U: 0x01 << 5, // Unused
	V: 0x01 << 6, // Overflow
	N: 0x01 << 7 // Negative
});

export class SRegister extends Int8Register {
	inc() {
		return;
	}
	dec() {
		return;
	}
	getFlag(pFlag) {
		return (this.get() & pFlag) == pFlag ? 0x01 : 0x00;
	}
	setFlag(pFlag, pBit) {
		if (pBit) {
			this.set(this.get() | pFlag);
		} else {
			this.set(this.get() & ~pFlag);
		}
	}
	getC() {
		return this.getFlag(SFlags.C);
	}
	setC(pBit) {
		this.setFlag(SFlags.C, pBit);
	}
	getZ() {
		return this.getFlag(SFlags.Z);
	}
	setZ(pBit) {
		this.setFlag(SFlags.Z, pBit);
	}
	getI() {
		return this.getFlag(SFlags.I);
	}
	setI(pBit) {
		this.setFlag(SFlags.I, pBit);
	}
	getD() {
		return this.getFlag(SFlags.D);
	}
	setD(pBit) {
		this.setFlag(SFlags.D, pBit);
	}
	getB() {
		return this.getFlag(SFlags.B);
	}
	setB(pBit) {
		this.setFlag(SFlags.B, pBit);
	}
	getU() {
		return this.getFlag(SFlags.U);
	}
	setU(pBit) {
		this.setFlag(SFlags.U, pBit);
	}
	getV() {
		return this.getFlag(SFlags.V);
	}
	setV(pBit) {
		this.setFlag(SFlags.V, pBit);
	}
	getN() {
		return this.getFlag(SFlags.N);
	}
	setN(pBit) {
		this.setFlag(SFlags.N, pBit);
	}
}

export default new SRegister();
