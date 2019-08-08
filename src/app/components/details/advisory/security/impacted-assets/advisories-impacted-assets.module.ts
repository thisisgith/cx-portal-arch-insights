import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiTableModule } from '@cisco-ngx/cui-components';
import { AdvisoriesImpactedAssetsComponent } from './advisories-impacted-assets.component';

/**
 * Field Notice Details Header Module
 */
@NgModule({
	declarations: [AdvisoriesImpactedAssetsComponent],
	exports: [AdvisoriesImpactedAssetsComponent],
	imports: [
		CommonModule,
		CuiTableModule,
		I18nPipeModule,
	],
})
export class AdvisoriesImpactedAssetsModule { }
