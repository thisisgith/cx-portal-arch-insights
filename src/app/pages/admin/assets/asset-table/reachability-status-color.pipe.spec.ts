import { ReachabilityStatusColorPipe } from './reachability-status-color.pipe';

describe('AppStatusColorPipe', () => {
	let pipe: ReachabilityStatusColorPipe;

	beforeEach(() => {
		pipe = new ReachabilityStatusColorPipe();
	});

	it('should return a hex color', () => {
		const cssClass = pipe.transform('Reachable');
		expect(cssClass)
			.toBe('#6cc04a');
	});

	it('should default to red', () => {
		const cssClass = pipe.transform('bad value');
		expect(cssClass)
			.toBe('#e3e3e3');
	});
});
