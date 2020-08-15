import { Int8 } from './int8';

export class Int32 extends Int8 {
	constructor() {
		super();
		this._Data = 0x00000000;
		this._Mask = 0xffffffff;
	}
}

export default new Int32();
