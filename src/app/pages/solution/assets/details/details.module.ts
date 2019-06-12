import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsComponent } from './details.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiTabsModule } from '@cisco-ngx/cui-components';
import { CaseService } from '@cui-x/services';
import { DetailsHeaderModule } from './details-header/details-header.module';
import { TimelineModule } from '@components';

/** Module representing the Asset Details Component */
@NgModule({
	declarations: [AssetDetailsComponent],
	exports: [AssetDetailsComponent],
	imports: [
		CommonModule,
		CuiTabsModule,
		I18nPipeModule,
		DetailsHeaderModule,
		TimelineModule,
	],
	providers: [
		CaseService,
	],
})
export class AssetDetailsModule { }
