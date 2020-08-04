export class Bit {
	_Data = 0b0;
	_Mask = 0b1;
	get() {
		return this._Data;
	}
	set(pData) {
		this._Data = pData & this._Mask;
	}
	inc() {
		this.set((this.get() + 0x01) & this._Mask);
	}
	dec() {
		this.set((this.get() - 0x01) & this._Mask);
	}
}

export default new Bit();
