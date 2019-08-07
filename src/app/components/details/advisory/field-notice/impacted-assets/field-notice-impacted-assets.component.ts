import {
	Component,
	Input,
	OnInit,
	ViewChild,
	TemplateRef,
} from '@angular/core';
import { Data as FieldNoticeData } from '../field-notice-details.component';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';

/**
 * Field Notice Impacted Assets
 */
@Component({
	selector: 'field-notice-impacted-assets',
	templateUrl: './field-notice-impacted-assets.component.html',
})
export class FieldNoticeImpactedAssetsComponent implements OnInit {

	@Input('details') public details: FieldNoticeData;

	@ViewChild('deviceColumn', null) public deviceColumn: TemplateRef<any>;
	@ViewChild('ipAddressColumn', null) public ipAddressColumn: TemplateRef<any>;
	@ViewChild('versionColumn', null) public softwareVersionColumn: TemplateRef<any>;
	@ViewChild('recommendedVersionColumn', null) public recommendedVersionColumn: TemplateRef<any>;

	public impactedAssetsTable: CuiTableOptions;

	/**
	 * refreshes the component
	 */
	public refresh () {
		this.impactedAssetsTable = new CuiTableOptions({
			bordered: true,
			columns: [
				{
					key: 'device',
					name: I18n.get('_Device_'),
					sortable: true,
					template: this.deviceColumn,
				},
				{
					name: I18n.get('_IPAddress_'),
					sortable: false,
					template: this.ipAddressColumn,
				},
				{
					name: I18n.get('_SoftwareVersion_'),
					sortable: false,
					template: this.softwareVersionColumn,
				},
				{
					name: I18n.get('_RecommendedSoftwareVersion_'),
					sortable: false,
					template: this.recommendedVersionColumn,
				},
			],
			padding: 'compressed',
			striped: false,
			wrapText: false,
		});
	}

	/**
	 * Initializes the component
	 */
	public ngOnInit () {
		this.refresh();
	}
}
