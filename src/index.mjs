// Libs
import Vue from 'vue';
import _ from 'lodash';
// Modules
import './assets/css/style.scss';
import Emulator from './module/emulator';
import Debug from './module/debug';

const CLOCK_TIMEOUT = 1;
const vm = new Vue({
	el: '#NESEmulator',
	data: function () {
		return {
			clockID: null,
			userProgram: '',
			DEBUG: null
		};
	},
	computed: {
		prtAddrRel() {
			return (this.DEBUG.CPUDebug.PC + this.DEBUG.CPUDebug.AddrRel) & 0xffff;
		},
		RAMTable() {
			const RAMData = this.DEBUG.RAM;
			const start = RAMData.Start;
			const end = RAMData.Start + 256; // RAMData.End;
			let lTable = [];
			for (let i = start; i <= end; i += 16) {
				let lRow = [{ addr: i, byte: 0x00 }];
				for (let j = 0; j <= 15; j++) {
					const addr = i + j;
					const byte = RAMData[addr].byte;
					lRow.push({
						addr: addr,
						byte: byte
					});
				}
				lTable.push(lRow);
			}
			return lTable;
		},
		PROTable() {
			const PROData = this.DEBUG.Program;
			const start = 0x8000; // PROData.Start;
			const end = 0x8000 + 256; // 1024; // PROData.End;
			let lTable = [];
			for (let i = start; i <= end; i += 16) {
				let lRow = [{ addr: i, byte: 0x00 }];
				for (let j = 0; j <= 15; j++) {
					const addr = i + j;
					const byte = PROData[addr].byte;
					lRow.push({
						addr: addr,
						byte: byte
					});
				}
				lTable.push(lRow);
			}
			return lTable;
		}
	},
	methods: {
		start() {
			this.stop();
			this.clockID = window.setInterval(this.clock, CLOCK_TIMEOUT);
			/*const _tick = () => {
				console.log('tick');
				this.clock();
				this.clockID = window.setTimeout(_tick, CLOCK_TIMEOUT);
			};
			_tick();*/
		},
		stop() {
			if (this.clockID) {
				window.clearInterval(this.clockID);
				//window.clearTimeout(this.clockID);
				this.clockID = null;
			}
			Emulator.stop();
		},
		reset() {
			Emulator.reset();
		},
		clock() {
			Emulator.clock();
		},
		step() {
			if (!this._ClockID) {
				this.clock();
			}
		},
		irq() {
			Emulator.irq();
		},
		nmi() {
			Emulator.nmi();
		},
		loadProgram() {
			this.stop();
			this.reset();
			this.userProgram = Debug.loadProgram(this.userProgram);
		},
		displayByte(pByte, pIndex) {
			if (pIndex != undefined && pIndex == 0) {
				let tByte = pByte.toString(16);
				while (tByte.length < 4) {
					tByte = '0' + tByte;
				}
				return '$' + tByte.toUpperCase() + ':';
			}
			let tByte = pByte.toString(16);
			if (tByte.length <= 1) {
				tByte = '0' + tByte;
			}
			return '0x' + tByte.toUpperCase();
		},
		displayByteClass(pRowI, pAddr) {
			if (pRowI == 0) {
				return 'memAddr';
			}
			let lClass = ['memByte'];
			if (this.DEBUG.CPUDebug.PC == pAddr) {
				lClass.push('PCAddr');
			} else if (this.DEBUG.CPUDebug.StackPointer == pAddr) {
				lClass.push('StackPointerAddr');
			}
			return lClass.join(' ');
		}
	}
});

// Load program
Debug.init(self, vm);
vm.loadProgram();

$(function () {
	const leadingZero = (pString, pLength) => {
		while (pString.length < pLength) {
			pString = '0' + pString;
		}
		return pString;
	};
	// onload
	$('.tblMem')
		.on('mouseenter', '.memByte', function () {
			const element = $(this).addClass('pointByte');
			const addr = parseInt(element.attr('data-addr'), 10);
			const byte = parseInt(element.attr('data-byte'), 10);
			const source = element.attr('data-src');
			const addrH = leadingZero(addr.toString(16).toUpperCase(), 4);
			const byteH = leadingZero(byte.toString(16).toUpperCase(), 2);
			const byteB = leadingZero(byte.toString(2).toUpperCase(), 8);
			const offset = $(`#infoByte${source}`).offset();
			const id = `byteInfo_${addr}`;
			$('<div>')
				.css({ position: 'absolute', top: offset.top, left: offset.left + 5 })
				.attr('id', id)
				.append($('<b>').text(`$${addrH}: `))
				.append(document.createTextNode(`0x${byteH} (0b${byteB}) [${byte}]`))
				.appendTo('body');
		})
		.on('mouseleave', '.memByte', function () {
			const element = $(this).removeClass('pointByte');
			const addr = parseInt(element.attr('data-addr'), 10);
			const id = `byteInfo_${addr}`;
			$(`#${id}`).remove();
		});
});
