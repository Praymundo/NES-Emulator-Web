import BUS from './bus';

export class Emulator {
	constructor() {}
	clock() {
		BUS.clock();
	}
	start() {
		BUS.reset();
	}
	stop() {
		// Set stop code??
	}
	reset() {
		BUS.reset();
	}
	irq() {
		BUS.irq();
	}
	nmi() {
		BUS.nmi();
	}
}

export default new Emulator();
