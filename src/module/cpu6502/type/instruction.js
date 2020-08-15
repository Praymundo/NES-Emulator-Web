import CPU from '../../cpu6502';

export class Instruction {
	constructor(pName, pOperation, pAddrMode, pCycles) {
		this.Name = pName;
		this.Operation = () => pOperation.call(CPU);
		this.AddrMode = () => pAddrMode.call(CPU);
		this.Cycles = pCycles;
		this.OperationIsA = (fn) => pOperation == fn;
		this.AddrModeIsA = (fn) => pAddrMode == fn;
	}
}
