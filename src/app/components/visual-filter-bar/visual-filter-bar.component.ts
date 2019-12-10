import {
	ChangeDetectorRef,
	ContentChild,
	Component,
	ElementRef,
	Input,
	OnInit,
	TemplateRef,
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
export class VisualFilterBarComponent implements OnInit {
	@ContentChild('startingCard', { static: true }) public customCard: TemplateRef<any>;
	@ViewChild('carousel', { static: false }) public carouselRef: ElementRef;
	@Input() public filters: VisualFilter[];
	@Input() public filterCollapse = false;
	/* starting index for the carousel. If no custom card is provided,
	we fill that static slot with the first card,
	so the carousel starts at the 2nd one (index 1) */
	public startIndex = 1;

	constructor (
		private cdr: ChangeDetectorRef,
	) { }

	/**
	 * OnInit Lifecycle hook
	 */
	public ngOnInit () {
		if (this.customCard) {
			this.startIndex = 0;
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
		const itemWidth = carousel.children[0].offsetWidth; // all children should be same width
		carousel.scrollTo(carousel.scrollLeft + (shift * itemWidth), 0);
	}

}
