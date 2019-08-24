import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FingerprintDetailsComponent } from './fingerprint-details.component';
import { FingerprintHeaderModule } from './fingerprint-header/fingerprint-header.module';
import { FingerprintBodyModule } from './fingerprint-body/fingerprint-body.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { DetailsPanelModule } from '@components';

/**
 * fingerprint-details Module
 */
@NgModule({
	declarations: [FingerprintDetailsComponent],
	exports: [FingerprintDetailsComponent],
	imports: [
		CommonModule,
		FingerprintHeaderModule,
		FingerprintBodyModule,
		I18nPipeModule,
		DetailsPanelModule,
	],
})
export class FingerprintDetailsModule { }
