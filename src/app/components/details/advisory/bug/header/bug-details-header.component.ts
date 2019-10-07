import {
	Component,
	Input,
} from '@angular/core';
import { Asset, NetworkElement } from '@sdp-api';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { Data as BugData } from '../bug-details.component';
import {
	CaseOpenAdvisoriesComponent,
} from '../../../../case/case-open/case-open-advisories/case-open-advisories.component';
import { environment } from '@environment';

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
	@Input('impactedAssets') public impactedAssets: (Asset | NetworkElement)[];
	public bugSearchToolURL = environment.bugSearchTool;

	/**
	 * Fires when user clicks "Open a Case" button
	 */
	public onOpenCase () {
		this.cuiModalService.showComponent(CaseOpenAdvisoriesComponent, {
			advisory: this.details.advisory,
			otherAssets: this.impactedAssets,
			selectedAsset: this.selectedAsset,
			type: 'bug',
		}, 'fluid');
	}
}
