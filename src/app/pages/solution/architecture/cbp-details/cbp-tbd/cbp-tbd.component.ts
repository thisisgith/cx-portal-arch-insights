import {
	Component,
	Input,
	TemplateRef,
	ViewChild,
	OnChanges,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { ArchitectureService , IException, IAsset} from '@sdp-api';

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
	public tableIndex = 0;
	public tableData: IException[] = [];
	public isLoading:boolean = true;
	public params : any ={
		page : 0,
		pageSize : 8,
		body :[],
	};

	constructor (private logger: LogService, private architectureService: ArchitectureService) {
	}

	/**
	 * Used to detect the changes in input object and call the getdata function
	 */
	public ngOnChanges () {
		if (this.cbpDetails) {
			const ruleIdsWithExceptions :string[] = this.cbpDetails.ruleIdsWithExceptions.split(';');
			this.totalItems = ruleIdsWithExceptions.length;
			this.params.body = ruleIdsWithExceptions;
			this.params.page = 0 ;
			this.isLoading = true;
			this.getData();
		}
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
		this.tableIndex = this.params.page * this.params.pageSize;
		this.architectureService.getAllCBPExceptionDetails(this.params)
				.subscribe((res: IException[]) => {
					this.tableData = res;
					this.isLoading = false;
				});
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
