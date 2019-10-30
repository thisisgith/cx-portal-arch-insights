import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { Tags } from '@sdp-api';

/**
 * Component for Tag List
 */
@Component({
	selector: 'tag-list',
	styleUrls: ['./tag-list.component.scss'],
	templateUrl: './tag-list.component.html',
})
export class TagListComponent {

	@ViewChild('container', { static: false }) public container: any;
	@Input() public rowHeight = 50;
	@Input() public items: Tags[];
	@Input() public loading: true;
	@Input() public searchText = '';
	@Input() public isDisabled = false;
	@Output() public selectionEvent = new EventEmitter<any>();
	public itemsInView: Tags[];
	public startIndex = 0;
	public endIndex = 0;
	constructor (
		private logger: LogService,
	) { }

	/**
	 * Refreshes virtual list on after view init
	 */
	public ngAfterViewInit () {
		this.refresh();
	}

	/**
	 * Called when items is updated. Adds right items to view.
	 */
	public ngDoCheck () {
		if (this.items) {
			this.itemsInView = this.items.slice(this.startIndex, this.endIndex);
		}
	}

	/**
	 * Toggles is tag row is selected
	 * Emits selection event with tag info to parent component
	 * @param tag tag row
	 */
	public toggleTagSelected (tag: Tags) {
		if (!this.isDisabled) {
			tag.selected = !tag.selected;
			this.selectionEvent.emit(tag);
		}
	}

	/**
	 * Refreshes virtual scroll items
	 */
	public refresh () {
		if (this.container) {
			const scrollTop = this.container.nativeElement.scrollTop;
			const height = this.container.nativeElement.clientHeight;
			this.startIndex = Math.floor(scrollTop / this.rowHeight);
			this.endIndex = Math.ceil((scrollTop + height) / this.rowHeight);
			if (this.items) {
				this.itemsInView = this.items.slice(this.startIndex, this.endIndex);
			}
		}
	}

}
