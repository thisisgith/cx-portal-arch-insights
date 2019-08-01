import { AppStatusColorPipe } from './app-status-color.pipe';

describe('AppStatusColorPipe', () => {
	let pipe: AppStatusColorPipe;

	beforeEach(() => {
		pipe = new AppStatusColorPipe();
	});

	it('should return a class', () => {
		const cssClass = pipe.transform('Running');
		expect(cssClass)
			.toBe('text-success');
	});

	it('should default to red', () => {
		const cssClass = pipe.transform('bad value');
		expect(cssClass)
			.toBe('text-danger');
	});
});
