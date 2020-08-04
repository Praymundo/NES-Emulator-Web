import { Bit } from './bit';

export class Int8 extends Bit {
	_Data = 0x00;
	_Mask = 0xff;
}

export default new Int8();
