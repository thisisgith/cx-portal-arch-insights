import {
	Component,
	Input,
} from '@angular/core';
import { Asset, CriticalBug } from '@sdp-api';
import { CuiModalService } from '@cisco-ngx/cui-components';
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

	@Input('details') public details: CriticalBug;
	@Input('selectedAsset') public selectedAsset: Asset;

	/**
	 * Fires when user clicks "Open a Case" button
	 */
	public onOpenCase () {
		this.cuiModalService.showComponent(CaseOpenAdvisoriesComponent, {
			advisory: this.details,
			selectedAsset: this.selectedAsset,
			type: 'bug',
		}, 'full');
	}
}
