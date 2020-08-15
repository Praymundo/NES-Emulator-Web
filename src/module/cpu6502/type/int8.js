import { Bit } from './bit';

export class Int8 extends Bit {
	constructor() {
		super();
		this._Data = 0x00;
		this._Mask = 0xff;
	}
}

export default new Int8();
