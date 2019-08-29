import {
	Component,
	Input,
} from '@angular/core';
import { CuiModalService } from '@cisco-ngx/cui-components';

import { Asset, NetworkElement } from '@sdp-api';
import {
	CaseOpenAdvisoriesComponent,
} from '../../../../case/case-open/case-open-advisories/case-open-advisories.component';
import { Data as SecurityData } from '../security-details.component';

/**
 * Security Details Header
 */
@Component({
	selector: 'security-details-header',
	styleUrls: ['./security-details-header.component.scss'],
	templateUrl: './security-details-header.component.html',
})
export class SecurityDetailsHeaderComponent {
	constructor (private cuiModalService: CuiModalService) { }

	@Input('details') public details: SecurityData;
	@Input('selectedAsset') public selectedAsset: Asset;
	@Input('impactedAssets') public impactedAssets: (Asset | NetworkElement)[] = [];

	/**
	 * Fires when user clicks "Open a Case" button
	 */
	public onOpenCase () {
		this.cuiModalService.showComponent(CaseOpenAdvisoriesComponent, {
			advisory: this.details.bulletin,
			otherAssets: this.impactedAssets,
			selectedAsset: this.selectedAsset,
			type: 'security',
		}, 'full');
	}
}
