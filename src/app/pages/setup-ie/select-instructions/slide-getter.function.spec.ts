import { Selection } from '../setup-ie.types';
import { getSlides } from './slide-getter.function';

describe('SlideGetterFunction', () => {
	it('should get slides', () => {
		let slides = getSlides(Selection.VBOX);
		expect(slides[0])
			.not
			.toBeNull();
		slides = getSlides(Selection.VCENTER);
		expect(slides[0])
			.not
			.toBeNull();
		slides = getSlides(Selection.VSPHERE);
		expect(slides[0])
			.not
			.toBeNull();
	});
});
