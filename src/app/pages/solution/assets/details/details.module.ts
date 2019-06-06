import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsComponent } from './details.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { CuiTabsModule } from '@cisco-ngx/cui-components';
import { CaseService } from '@cui-x/services';

/** Module representing the Asset Details Component */
@NgModule({
	declarations: [AssetDetailsComponent],
	exports: [AssetDetailsComponent],
	imports: [
		CommonModule,
		CuiTabsModule,
		I18nPipeModule,
	],
	providers: [
		CaseService,
	],
})
export class AssetDetailsModule { }
