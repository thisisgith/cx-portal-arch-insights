import {
	Component,
	Input,
	TemplateRef,
	ViewChild,
	OnChanges,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { ArchitectureService } from '@sdp-api';

/**
 * CBP TBD table Component
 */
@Component({
	selector: 'cbp-tbd',
	styleUrls: ['./cbp-tbd.component.scss'],
	templateUrl: './cbp-tbd.component.html',
})
export class CbpTbdComponent implements OnChanges {

	@Input('cbpDetails') public cbpDetails: any;
	@ViewChild('riskTmpl', { static: true }) public riskTemplate: TemplateRef<any>;
	public tableOptions: CuiTableOptions;
	public tableLimit = 8;
	public tableOffset = 0;
	public totalItems = 0;
	public tableIndex = 0;
	public tableData: any[] = [];
	public tempData: any[] = [];

	constructor (private logger: LogService, private architectureService: ArchitectureService) {
	}

	/**
	 * Used to detect the changes in input object and call the getdata function
	 */
	public ngOnChanges () {
		if (this.cbpDetails) {
			const ruleIdsWithExceptions = this.cbpDetails.ruleIdsWithExceptions.split(';');
			this.architectureService.getAllCBPExceptionDetails(ruleIdsWithExceptions)
				.subscribe((res: any[]) => {
					this.tempData = res;
					this.totalItems = this.tempData.length;
					this.tableOffset = 0;
					this.getData();
				});
		}
	}
	/**
	 * Used for getting pageNumber Index and call the getdata function
	 * @param pageInfo - The Object that contains pageNumber Index
	 */
	public onPagerUpdated (pageInfo: any) {
		this.tableOffset = pageInfo.page;
		this.getData();
	}
	/**
	 * used for setting the data for table
	 */
	public getData () {
		this.tableIndex = this.tableOffset * this.tableLimit;
		this.tableData = this.tempData.slice(this.tableIndex, this.tableIndex + this.tableLimit);
	}
	/**
	 * used for expanding one table row at a time.
	 * @param selectedItem - Item which is selected and to be expanded
	 */
	public expandRow (selectedItem: any) {
		selectedItem.active = !selectedItem.active;
		this.tableData = this.tableData.map(item => {
			if (item !== selectedItem) {
				item.active = false;
			}

			return item;
		});
	}
}
