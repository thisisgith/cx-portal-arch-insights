import { CourierLinkPipe } from './courier-link.pipe';

describe('CourierLinkPipe', () => {

	it('should create an instance', () => {
		const pipe = new CourierLinkPipe();
		expect(pipe)
			.toBeTruthy();
	});

	it('should return null on incorrect link input', () => {
		const pipe = new CourierLinkPipe();
		const incorrectLink = pipe.transform(null);
		expect(incorrectLink)
			.toBeNull();
	});

});
