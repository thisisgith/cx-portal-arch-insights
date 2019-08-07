import {
	Component,
	Input,
	OnInit,
	ViewChild,
	TemplateRef,
} from '@angular/core';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { Data as AdvisoryData } from '../security-details.component';
import { I18n } from '@cisco-ngx/cui-utils';

/**
 * Field Notice Impacted Assets
 */
@Component({
	selector: 'advisories-impacted-assets',
	templateUrl: './advisories-impacted-assets.component.html',
})
export class AdvisoriesImpactedAssetsComponent implements OnInit {

	@Input('details') public details: AdvisoryData;

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
