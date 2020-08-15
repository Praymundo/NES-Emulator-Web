export class RAM {
	constructor() {
		this._RAMSize = 0x07ff;
		this._Data = {};
		this._Mask = 0xff;
	}
	read(pAddress) {
		return (this._Data[pAddress & this._RAMSize] || 0x00) & this._Mask;
	}
	write(pAddress, pData) {
		this._Data[pAddress & this._RAMSize] = pData & this._Mask;
	}
}

export default new RAM();
