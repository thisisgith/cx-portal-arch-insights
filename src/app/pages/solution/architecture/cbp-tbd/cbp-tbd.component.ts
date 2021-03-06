import {
	Component,
	Input,
	TemplateRef,
	ViewChild,
	OnChanges,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { ArchitectureService, IException, IAsset, ArchitectureReviewService } from '@sdp-api';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';

/**
 * CBP TBD table Component
 */
@Component({
	selector: 'cbp-tbd',
	styleUrls: ['./cbp-tbd.component.scss'],
	templateUrl: './cbp-tbd.component.html',
})
export class CbpTbdComponent implements OnChanges {

	@Input('cbpDetails') public cbpDetails: IAsset;
	@ViewChild('riskTmpl', { static: true }) public riskTemplate: TemplateRef<any>;
	public tableOptions: CuiTableOptions;
	public totalItems = 0;
	public tableStartIndex = 0;
	public tableEndIndex = 0;
	public exceptionDatas: IException[] = [];
	public isLoading = true;
	public customerId = '';
	public params: any = {
		 body : [],
		 collectionId: '',
		 customerId: '',
		page : 0,
		pageSize : 10,
	};
	public destroy$ = new Subject();

	constructor (private logger: LogService,
		private architectureService: ArchitectureService,
		private architectureReviewService: ArchitectureReviewService,
		private route: ActivatedRoute) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.params.customerId =  _.cloneDeep(this.customerId);
		this.getCollectionId();
	}

	/**
	 * Used to detect the changes in input object and call the getdata function
	 */
	public ngOnChanges () {
		if (this.cbpDetails) {
			const ruleIdsWithExceptions: string[] = this.cbpDetails
				.ruleIdWithExceptions.split(';');
			this.totalItems = ruleIdsWithExceptions.length;
			this.params.body = ruleIdsWithExceptions;
			this.params.page = 0 ;
			this.isLoading = true;
			this.getData();
		}
	}

	/**
	 * Method to fetch collectionId
	 */

	public getCollectionId () {
		this.architectureReviewService.getCollectionId()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe(res => {
			this.params.collectionId = _.get(res, 'collection.collectionId');
		},
		err => {
			this.logger.error('Devices list Component View' +
				'  : getCollectionId() ' +
				`:: Error : (${err.status}) ${err.message}`);
		});
	 }
	/**
	 * Used for getting pageNumber Index and call the getdata function
	 * @param pageInfo - The Object that contains pageNumber Index
	 */
	public onPagerUpdated (pageInfo: any) {
		this.params.page =  pageInfo.page;
		this.isLoading = true;
		this.getData();
	}
	/**
	 * used for setting the data for table
	 */
	public getData () {
		this.tableStartIndex = this.params.page * this.params.pageSize;
		const endIndex = (this.tableStartIndex + this.exceptionDatas.length);
		this.tableEndIndex = (endIndex) > this.totalItems ? this.totalItems : endIndex;

		this.architectureService.getAllCBPExceptionDetails(this.params)
		.pipe(
			takeUntil(this.destroy$),
		)
				.subscribe((res: IException[]) => {
					this.exceptionDatas = res;
					this.isLoading = false;
					this.tableEndIndex = (this.tableStartIndex + this.exceptionDatas.length);
				},
					err => {
						this.logger.error('CBP-TDB Fly-Out View' +
							'  : getData() ' +
							`:: Error : (${err.status}) ${err.message}`);
						this.isLoading = false;
						this.exceptionDatas = [];
						this.totalItems = 0;
					});
	}
	/**
	 * used for expanding one table row at a time.
	 * @param selectedItem - Item which is selected and to be expanded
	 */
	public expandRow (selectedItem: IException) {
		selectedItem.active = !selectedItem.active;
		this.exceptionDatas = this.exceptionDatas.map(item => {
			if (item !== selectedItem) {
				item.active = false;
			}

			return item;
		});
	}
}
