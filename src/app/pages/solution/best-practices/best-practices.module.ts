import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BestPracticesComponent } from './best-practices.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { BestPracticesRoutingModule } from './best-practices-routing.module';

/**
 * Module representing the Best Practices component of the Solution Page
 */
@NgModule({
	declarations: [BestPracticesComponent],
	imports: [
		CommonModule,
		I18nPipeModule,
		BestPracticesRoutingModule,
	],
})
export class BestPracticesModule { }
