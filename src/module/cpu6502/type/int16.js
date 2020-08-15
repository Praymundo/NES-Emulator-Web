import { Int8 } from './int8';

export class Int16 extends Int8 {
	constructor() {
		super();
		this._Data = 0x0000;
		this._Mask = 0xffff;
	}
}

export default new Int16();
