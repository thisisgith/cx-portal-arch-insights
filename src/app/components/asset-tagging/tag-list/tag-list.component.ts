import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { Tags } from '@sdp-api';
import * as _ from 'lodash-es';

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
	@Input() public textForTagList;
	@Output() public selectionEvent = new EventEmitter<any>();
	public startIndex = 0;
	public endIndex = 0;
	constructor (
		private logger: LogService,
	) { }

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
	 * Sorts tags based on tagName
	 * @param tags Array of Tags
	 * @returns Sorted Tags
	 */
	public sortAndFilterTags (tags: Tags[]) {

		if (!tags) {
			return tags;
		}
		tags.sort((t1 , t2) => (t1.tagName > t2.tagName) ? 1 : -1);

		return this.filterTags(tags);

	}

	/**
	 * Filtering tags based on search Text
	 * @param tags Array of Tags
	 * @returns Filtered Tags
	 */
	public filterTags (tags: Tags[]) {
		if (!this.searchText) {
			return tags;
		}

		if (this.searchText.indexOf(',') !== -1) {
			const searchTags = _.split(this.searchText, ',');

			return _.filter(tags, tag => searchTags.some(searchTag =>
					tag.tagName.toLowerCase() === searchTag.toLowerCase()));
		}

		return _.filter(tags, tag =>
				tag.tagName.toLowerCase()
					.indexOf(this.searchText.toLowerCase()) !== -1);
	}
}
