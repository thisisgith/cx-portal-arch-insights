import { CuiTimelineModule } from '@cisco-ngx/cui-components';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetActivityComponent } from './activity.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CaseService } from '@cui-x/services';

/** Module representing the Asset Activity Component */
@NgModule({
	declarations: [AssetActivityComponent],
	exports: [AssetActivityComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		CuiTimelineModule,
	],
	providers: [
		CaseService,
	],
})
export class AssetActivityModule { }
