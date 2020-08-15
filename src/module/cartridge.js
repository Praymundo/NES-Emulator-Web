export class Cartridge {
	constructor() {
		this._Data = {};
		this._Mask = 0xff;
	}
	checkCpuRead(pAddress) {
		/// For the moment Cartridge will respond to every read / write that is not RAM
		if (pAddress >= 0x2000) {
			return 0x01;
		}
		return 0x00;
	}
	checkCpuWrite(pAddress) {
		/// For the moment Cartridge will respond to every read / write that is not RAM
		if (pAddress >= 0x2000) {
			return 0x01;
		}
		return 0x00;
	}
	cpuRead(pAddress) {
		if (!this.checkCpuRead(pAddress)) {
			return 0x00;
		}
		return (this._Data[pAddress & 0xffff] || 0x00) & this._Mask;
	}
	cpuWrite(pAddress, pData) {
		if (!this.checkCpuWrite(pAddress)) {
			return;
		}
		this._Data[pAddress & 0xffff] = pData & this._Mask;
	}
}

export default new Cartridge();
