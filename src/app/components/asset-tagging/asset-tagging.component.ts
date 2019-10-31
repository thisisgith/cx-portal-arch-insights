import { Component, OnDestroy, Input, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { LogService } from '@cisco-ngx/cui-services';
import * as _ from 'lodash-es';
import { Tags, AssetTaggingService } from '@sdp-api';

/**
 * Component for Asset Tagging
 */
@Component({
	selector: 'asset-tagging',
	styleUrls: ['./asset-tagging.component.scss'],
	templateUrl: './asset-tagging.component.html',
})
export class AssetTaggingComponent implements OnChanges, OnDestroy {

	@Input() public tagListRight: Tags[] = [];
	@Input() public tagListLeft: Tags[] = [];
	public leftTags = 'left';
	public rightTags = 'right';
	public allTagsSelectedRight = false;
	public allTagsSelectedLeft = false;
	public loadingListLeft = false;
	public loadingListRight = false;
	private destroyed$: Subject<void> = new Subject<void>();
	public isOptin = true;
	public policyGroups: string[] = [];
	public totalRows = undefined;
	public rowsPerPage = 10;
	public selectedRowsRight = { };
	public selectedRowsLeft = { };
	public selectedRowsLeftCount = 0;
	public selectedRowsRightCount = 0;
	public leftSearchText = '';
	public rightSearchText = '';
	public error = false;
	public success = false;
	public successMessage = '';
	public customerId: string;

	public postParams: Tags [] = [];

	constructor (
		private logger: LogService,
		public assetTaggingService: AssetTaggingService,
	) {
	}

	/**
	 * Used to detect the changes in input object and
	 * Intialises the Tagging data if it is visible
	 */
	public ngOnChanges () {
		this.handleLeftTagSelectionChanged();
		this.handleRightTagSelectionChanged();
	}

	/**
	 * returns tag list w/o the select attribute
	 * @returns any[]
	 */
	public getTagListNoSelect () {
		return  _.map(this.tagListRight, item => {
			const copy = this.jsonCopy(item);
			delete copy.selected;

			return copy;
		});
	}

	/**
	 * Toggles whether or not all Tags are selected
	 * @param tags tag row
	 * @param selectorName The designated name of the tag selector
	 * firing this function off
	 */
	public toggleAllTagsSelected (
		tags: Tags[],
		selectorName: string) {

		if (tags.length === 0) {
			return;
		}

		let selected = false;
		let searchText = '';

		if (selectorName === this.leftTags) {
			this.allTagsSelectedLeft = !this.allTagsSelectedLeft;
			selected = this.allTagsSelectedLeft;
			if (this.leftSearchText) {
				searchText = this.leftSearchText;
			}
		} else if (selectorName === this.rightTags) {
			this.allTagsSelectedRight = !this.allTagsSelectedRight;
			selected = this.allTagsSelectedRight;
			if (this.rightSearchText) {
				searchText = this.rightSearchText;
			}
		}

		for (let devNum = 0; devNum < tags.length; devNum += 1) {
			if (searchText) {
				const tagName = tags[devNum].tagName.toLowerCase();
				if (tagName.indexOf(searchText.toLowerCase()) > -1) {
					tags[devNum].selected = selected;
				}
			} else {
				tags[devNum].selected = selected;
			}
		}

		this.handleTagSelectionChanged(selectorName);
	}

	/**
	 * Submit the completed Collection Form
	 */
	public submit () {
		this.postParams = this.getTagListNoSelect();

		this.assetTaggingService.Tags = this.postParams;
	}

	/**
	 * Copies object using json stringify and json parse
	 * @param obj dict object
	 * @returns copied object
	 */
	public jsonCopy (obj) {
		return JSON.parse(JSON.stringify(obj));
	}

	/**
	 * Code for add button
	 * Moves selected list items from left list to right list
	 */
	public add () {
		for (let devNum = this.tagListLeft.length - 1; devNum >= 0; devNum -= 1) {
			if (this.tagListLeft[devNum].selected) {
				const deviceCopy = this.jsonCopy(this.tagListLeft[devNum]);
				deviceCopy.selected = false;

				this.tagListRight.push(deviceCopy);
				this.tagListLeft.splice(devNum, 1);
			}
		}

		this.allTagsSelectedLeft = false;
		this.tagListLeft = this.jsonCopy(this.tagListLeft);
		this.tagListRight = this.jsonCopy(this.tagListRight);
		this.handleLeftTagSelectionChanged();
	}

	/**
	 * Code for remove button
	 * Moves selected list items from right list to left list
	 */
	public remove () {
		for (let devNum = this.tagListRight.length - 1; devNum >= 0; devNum -= 1) {
			if (this.tagListRight[devNum].selected) {
				const deviceCopy = this.jsonCopy(this.tagListRight[devNum]);
				deviceCopy.selected = false;

				this.tagListLeft.push(deviceCopy);
				this.tagListRight.splice(devNum, 1);
			}
		}
		this.tagListLeft = this.jsonCopy(this.tagListLeft);
		this.tagListRight = this.jsonCopy(this.tagListRight);
		this.allTagsSelectedRight = false;
		this.handleRightTagSelectionChanged();
	}

	/**
	 * Handles when a tag list selection change has been detected.
	 * Delegates to the correct function based on a selection made on the
	 * left or the right.
	 * @param selectorName The designated name of the tag selector firing
	 * the event
	 */
	public handleTagSelectionChanged (selectorName: string) {
		switch (selectorName) {
			case this.leftTags:
				this.handleLeftTagSelectionChanged();
				break;
			case this.rightTags:
				this.handleRightTagSelectionChanged();
				break;
		}
	}

	/**
	 * Handles all left tag selection changes
	 */
	public handleLeftTagSelectionChanged () {
		this.selectedRowsLeftCount = _.filter(this.tagListLeft, ['selected', true]).length;
		this.submit();
	}

	/**
	 * Handles all right tag selection changes
	 */
	public handleRightTagSelectionChanged () {
		this.selectedRowsRightCount = _.filter(this.tagListRight, ['selected', true]).length;
		this.submit();
	}

	/**
	 * This function to handle the searched tags
	 * @param searchText it will have the searched tags
	 * @param selectorName The designated name of the tag selector
	 */
	public onSearchQuery (searchText: string, selectorName: string) {
		if (selectorName === this.leftTags) {
			this.leftSearchText = searchText.trim();
		} else {
			this.rightSearchText = searchText.trim();
		}
	}

	/**
	 * ngOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
