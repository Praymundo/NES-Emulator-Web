import CPU from './cpu6502';
import RAM from './ram';
import Cartridge from './cartridge';

export class Bus {
	constructor() {}
	cpuRead(pAddress, pReadOnly) {
		let data = 0x00;
		if (Cartridge.checkCpuRead(pAddress)) {
			// Cartridge
			data = Cartridge.cpuRead(pAddress);
		} else if (pAddress >= 0x0000 && pAddress <= 0x1fff) {
			// RAM (Mirror every 2048)
			data = RAM.read(pAddress & 0x07ff);
		} else if (pAddress >= 0x2000 && pAddress <= 0x3fff) {
			// PPU (Mirror every 8)
			// PPU.cpuRead(pAddress & 0x0007, pReadOnly);
			data = 0x00;
		} else if (pAddress == 0x4015) {
			// APU Read Status
			data = APU.cpuRead(pAddress);
		} else if (pAddress >= 0x4016 && pAddress <= 0x4017) {
			// Read out the MSB of the controller status word
			// data = (controller_state[pAddress & 0x0001] & 0x80) > 0;
			// controller_state[pAddress & 0x0001] <<= 1;
			data = 0x00;
		}
		return data & 0xff;
	}
	cpuWrite(pAddress, pData) {
		if (Cartridge.checkCpuWrite(pAddress)) {
			// Cartridge
			Cartridge.cpuWrite(pAddress, pData);
		} else if (pAddress >= 0x0000 && pAddress <= 0x1fff) {
			// RAM (Mirror every 2048)
			RAM.write(pAddress & 0x07ff, pData);
		} else if (pAddress >= 0x2000 && pAddress <= 0x3fff) {
			// PPU (Mirror every 8)
			// PPU.cpuWrite(pAddress, pData);
		} else if ((pAddress >= 0x4000 && pAddress <= 0x4013) || pAddress == 0x4015 || pAddress == 0x4017) {
			// APU
		} else if (pAddress == 0x4014) {
			// DMA Transfer
		} else if (pAddress >= 0x4016 && pAddress <= 0x4017) {
			// "Lock In" controller state
		}
	}
	reset() {
		CPU.reset();
	}
	irq() {
		CPU.irq();
	}
	nmi() {
		CPU.nmi();
	}
	clock() {
		CPU.clock();
	}
}

export default new Bus();
