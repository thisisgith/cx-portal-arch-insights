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

	it('should return a download link', () => {
		const pipe = new DownloadLinkPipe();
		const fileName = 'file.txt';
		const caseNo = '123';
		const correctLink = pipe.transform(fileName, caseNo);
		expect(correctLink)
			.toBeTruthy();
	});

});
