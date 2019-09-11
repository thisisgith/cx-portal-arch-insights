import { MatchesPipe } from './matches.pipe';

describe('MatchesPipe', () => {
	it('create an instance', () => {
		const pipe = new MatchesPipe();
		expect(pipe)
			.toBeTruthy();
	});
});
