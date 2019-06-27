import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsCardViewComponent } from './assets-card-view.component';
import { CuiXTileModule } from '@cui-x/cui-x-components';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Module representing the bubble chart component for the Assets Page
 */
@NgModule({
	declarations: [AssetsCardViewComponent],
	exports: [AssetsCardViewComponent],
	imports: [
		CommonModule,
		CuiXTileModule,
		I18nPipeModule,
	],
	providers: [
	],
})
export class AssetsCardViewModule { }
