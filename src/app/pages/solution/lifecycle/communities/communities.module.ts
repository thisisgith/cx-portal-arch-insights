import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunitiesComponent } from './communities.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { EntitlementModule } from '@directives';

/** Module representing the Communities Component */
@NgModule({
	declarations: [CommunitiesComponent],
	exports: [CommunitiesComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		EntitlementModule,
	],
})
export class CommunitiesModule {
}
