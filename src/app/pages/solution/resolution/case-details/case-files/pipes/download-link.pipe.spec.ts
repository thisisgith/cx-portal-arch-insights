import { DownloadLinkPipe } from './download-link.pipe';

describe('DownloadLinkPipe', () => {

	it('should create an instance', () => {
		const pipe = new DownloadLinkPipe();
		expect(pipe)
			.toBeTruthy();
	});

	it('should return null on incorrect link input', () => {
		const pipe = new DownloadLinkPipe();
		const incorrectLink = pipe.transform(null, null);
		expect(incorrectLink)
			.toBeNull();
	});

});
