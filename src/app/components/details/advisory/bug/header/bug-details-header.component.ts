import {
	Component,
	Input,
} from '@angular/core';
import { Asset } from '@sdp-api';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { Data as BugData } from '../bug-details.component';
import {
	CaseOpenAdvisoriesComponent,
} from '../../../../case/case-open/case-open-advisories/case-open-advisories.component';

/**
 * Bug Details Header
 */
@Component({
	selector: 'bug-details-header',
	templateUrl: './bug-details-header.component.html',
})
export class BugDetailsHeaderComponent {

	constructor (private cuiModalService: CuiModalService) { }

	@Input('details') public details: BugData;
	@Input('selectedAsset') public selectedAsset: Asset;

	/**
	 * Fires when user clicks "Open a Case" button
	 */
	public onOpenCase () {
		this.cuiModalService.showComponent(CaseOpenAdvisoriesComponent, {
			advisory: this.details.advisory,
			selectedAsset: this.selectedAsset,
			type: 'bug',
		}, 'full');
	}
}
