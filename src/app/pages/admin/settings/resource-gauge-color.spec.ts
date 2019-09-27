import { ResourceGaugeColorPipe } from './resource-gauge-color.pipe';

describe('ResourceGaugeColorPipe', () => {
	let pipe: ResourceGaugeColorPipe;

	beforeEach(() => {
		pipe = new ResourceGaugeColorPipe();
	});

	it('should return red when danger', () => {
		const gaugeColor = pipe.transform('100');
		expect(gaugeColor)
			.toBe('#e2231a');
	});

	it('should return orange when warning', () => {
		const gaugeColor = pipe.transform('60');
		expect(gaugeColor)
			.toBe('#fbab18');
	});

	it('should return green when success', () => {
		const gaugeColor = pipe.transform('0');
		expect(gaugeColor)
			.toBe('#6ebe4a');
	});

	it('should default to black', () => {
		const gaugeColor = pipe.transform('other value');
		expect(gaugeColor)
			.toBe('#000');
	});
});
