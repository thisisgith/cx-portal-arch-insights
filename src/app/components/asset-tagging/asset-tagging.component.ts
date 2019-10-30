import { Component, OnDestroy, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { LogService } from '@cisco-ngx/cui-services';
import * as _ from 'lodash-es';
import { Tags, AssetTaggingService } from '@sdp-api';
import { ActivatedRoute } from '@angular/router';

/**
 * Component for Asset Tagging
 */
@Component({
	selector: 'asset-tagging',
	styleUrls: ['./asset-tagging.component.scss'],
	templateUrl: './asset-tagging.component.html',
})
export class AssetTaggingComponent implements OnChanges, OnDestroy {

	@Input() public policy = 'HIPPA';
	@Input() public visible = true;
	public leftTags = 'left';
	public rightTags = 'right';
	public allTagsSelectedRight = false;
	public allTagsSelectedLeft = false;
	public tagListRight: Tags[] = [];
	public tagListRightTemp: any = { };
	public tagListLeft: Tags[] = [];
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
	public params: AssetTaggingService.GetParams = {
		customerId : '',
	};

	public postParams: AssetTaggingService.PostParams = {
		body : {
			policy: '',
			tags : [],
			toBeScanned: true,
		},
		customerId : '',
	}

	constructor (
		private logger: LogService,
		private route: ActivatedRoute,
		public assetTaggingService: AssetTaggingService,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.params.customerId = _.get(user, ['info', 'customerId']);
	}

	/**
	 * Used to detect the changes in input object and
	 * Intialises the Tagging data if it is visible
	 * @param changes SimpleChanges
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const visible = _.get(changes, ['visible', 'currentValue']);
		// const policy = _.get(changes, ['policy', 'currentValue']);
		const isFirstChange = _.get(changes, ['filters', 'firstChange']);
		if (visible && !isFirstChange) {

			this.assetTaggingService.getPolicy(this.params)
				.subscribe(res => {
					this.policyGroups = this.jsonCopy(res.policyGroups);
				});
			this.runListCalls();
		}
	}

	/**
	 * Calls for both lists
	 */
	public runListCalls () {
		this.onLeftListCall();
		this.onRightListCall();
	}

	/**
	 * Called when policy is changed
	 */
	public onPolicyChange () {

		const filteredPolicyGroup =
			_.find(this.tagListRightTemp.policyGroups, { policyName : this.policy });

		const modifiedRightTags = _.map(filteredPolicyGroup.tags , (item: Tags) => {
			item.devices = filteredPolicyGroup.devices;

			return item;
		});

		this.tagListRight = this.jsonCopy(modifiedRightTags);
	}

	/**
	 * Calls api for getting left list data
	 */
	public onLeftListCall () {

		this.assetTaggingService.getAllTags(this.params)
			.subscribe(res => {
				this.tagListLeft = this.jsonCopy(res.tags);
				this.handleLeftTagSelectionChanged();
			});
	}

	/**
	 * Calls api for getting left list data
	 */
	public onRightListCall () {
		this.assetTaggingService.getTagsAssociatedWithPolicy(this.params)
			.subscribe(res => {
				const filteredPolicyGroup =
				_.find(res.policyGroups, { policyName : this.policy });
				this.tagListRightTemp = this.jsonCopy(res);

				const modifiedRightTags = _.map(filteredPolicyGroup.tags , (item: Tags) => {
					item.devices = filteredPolicyGroup.devices;

					return item;
				});

				this.tagListRight = this.jsonCopy(modifiedRightTags);
				this.handleRightTagSelectionChanged();
			});

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

		if (selectorName === this.leftTags) {
			this.allTagsSelectedLeft = !this.allTagsSelectedLeft;
			selected = this.allTagsSelectedLeft;
		} else if (selectorName === this.rightTags) {
			this.allTagsSelectedRight = !this.allTagsSelectedRight;
			selected = this.allTagsSelectedRight;
		}

		for (let devNum = 0; devNum < tags.length; devNum += 1) {
			tags[devNum].selected = selected;
		}

		this.handleTagSelectionChanged(selectorName);
	}

	/**
	 * Submit the completed Collection Form
	 */
	public onSubmit () {
		this.postParams.body.tags = this.getTagListNoSelect();
		this.postParams.body.policy = this.policy;
		this.postParams.body.toBeScanned = false;
		this.postParams.customerId = this.customerId;

		this.assetTaggingService.postPolicyMapping(this.postParams)
			.subscribe(() => {
				this.success = true;
				this.successMessage = "Data is saved and ran successfully";
			});
	}

	/**
	 * Copies object using json stringify and json parse
	 * @param obj dict object
	 * @returns copied object
	 */
	private jsonCopy (obj) {
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

		if (this.tagListLeft.length === 0) {
			this.allTagsSelectedLeft = false;
		}

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

		if (this.tagListRight.length === 0) {
			this.allTagsSelectedRight = false;
		}

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
	}

	/**
	 * Handles all right tag selection changes
	 */
	public handleRightTagSelectionChanged () {
		this.selectedRowsRightCount = _.filter(this.tagListRight, ['selected', true]).length;
	}

	/**
	 * This function to handle the searched tags
	 * @param searchText it will have the searched tags
	 * @param selectorName The designated name of the tag selector
	 */
	public onSearchQuery (searchText: string, selectorName: string) {
		if (selectorName === this.leftTags) {
			this.leftSearchText = searchText;
		} else {
			this.rightSearchText = searchText;
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
