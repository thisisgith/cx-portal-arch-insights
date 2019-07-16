import { ResourceGaugeColorPipe } from './resource-gauge-color.pipe';

describe('ResourceGaugeColorPipe', () => {
	let pipe: ResourceGaugeColorPipe;

	beforeEach(() => {
		pipe = new ResourceGaugeColorPipe();
	});

	it('should return danger', () => {
		const cssClass = pipe.transform('100');
		expect(cssClass)
			.toBe('danger');
	});

	it('should return warning', () => {
		const cssClass = pipe.transform('60');
		expect(cssClass)
			.toBe('warning');
	});

	it('should return success', () => {
		const cssClass = pipe.transform('0');
		expect(cssClass)
			.toBe('success');
	});

	it('should default to secondary', () => {
		const cssClass = pipe.transform('other value');
		expect(cssClass)
			.toBe('secondary');
	});
});
