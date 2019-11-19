import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunitiesComponent } from './communities.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { EntitlementDirective } from '@directives';

/** Module representing the Communities Component */
@NgModule({
	declarations: [CommunitiesComponent, EntitlementDirective],
	exports: [CommunitiesComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
	],
})
export class CommunitiesModule {
}
