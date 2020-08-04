import { Int8Register } from './type/int8Register';

export class SPRegister extends Int8Register {
	addr() {
		return 0x0100 + this.get();
	}
}

export default new SPRegister();
