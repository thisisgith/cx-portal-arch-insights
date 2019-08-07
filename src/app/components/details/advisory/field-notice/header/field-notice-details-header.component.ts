import {
	Component,
	Input,
} from '@angular/core';
import { Data as FieldNoticeData } from '../field-notice-details.component';
import { CuiModalService } from '@cisco-ngx/cui-components';
import {
	CaseOpenAdvisoriesComponent,
} from '../../../../case/case-open/case-open-advisories/case-open-advisories.component';
import { Asset } from '@sdp-api';

/**
 * Field Notice Details Header
 */
@Component({
	selector: 'field-notice-details-header',
	templateUrl: './field-notice-details-header.component.html',
})
export class FieldNoticeDetailsHeaderComponent {
	constructor (private cuiModalService: CuiModalService) { }

	@Input('details') public details: FieldNoticeData;
	@Input('selectedAsset') public selectedAsset: Asset;

	/**
	 * Fires when user clicks "Open a Case" button
	 */
	public onOpenCase () {
		this.cuiModalService.showComponent(CaseOpenAdvisoriesComponent, {
			advisory: this.details.bulletin,
			selectedAsset: this.selectedAsset,
			type: 'field',
		}, 'full');
	}
}
