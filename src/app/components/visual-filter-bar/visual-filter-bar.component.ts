import {
	AfterViewChecked,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
	ViewChild,
} from '@angular/core';

import { VisualFilter } from '@interfaces';

/**
 * Component representing a bar of visual filters
 */
@Component({
	selector: 'visual-filter-bar',
	styleUrls: ['./visual-filter-bar.component.scss'],
	templateUrl: './visual-filter-bar.component.html',
})
export class VisualFilterBarComponent implements AfterViewChecked {
	@ViewChild('carousel', { static: false }) public carouselRef: ElementRef;
	@Input() public filters: VisualFilter[];
	@Input() public filterCollapse = false;
	public isOverflowing = false;

	constructor (
		private cdr: ChangeDetectorRef,
	) { }

	/**
	 * AfterViewChecked lifecycle hook
	 */
	public ngAfterViewChecked () {
		/* Don't do anything if filters are hidden */
		if (!this.carouselRef) {
			return;
		}
		const element = this.carouselRef.nativeElement;
		const oldValue = this.isOverflowing;
		this.isOverflowing = (element.scrollWidth > element.clientWidth);
		// Only trigger extra change detection when the value has actually changed
		if (this.isOverflowing !== oldValue) {
			this.cdr.detectChanges();
		}
	}

	/**
	 * Shifts the carousel items.
	 * Positive values shift right, negative values shift left.
	 * Shift is multipled with the width of a single item.
	 * @param shift The direction and magnitude of shift.
	 */
	public shiftCarousel (shift: number) {
		const carousel = this.carouselRef.nativeElement;
		const itemWidth = carousel.children[1].offsetWidth; // all children should be same width
		carousel.scrollTo(carousel.scrollLeft + (shift * itemWidth), 0);
	}

}
