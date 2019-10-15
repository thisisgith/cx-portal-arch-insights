import { RemoveInvalidTagsPipe } from './remove-invalid-tags.pipe.module';

describe('RemoveInvalidTagsPipe', () => {
	let pipe: RemoveInvalidTagsPipe;
	beforeEach(() => {
		pipe = new RemoveInvalidTagsPipe();
	});
	it('should create pipe instance', () => {
		expect(pipe)
		.toBeTruthy();
	});

	it('should replace invalid tag code', () => {
		const actual = pipe.transform('<beg');
		expect(actual)
		.toEqual('&lt;beg');
	});
});
