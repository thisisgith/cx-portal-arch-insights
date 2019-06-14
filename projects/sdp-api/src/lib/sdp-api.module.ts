import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { MicroMockModule } from '@cui-x-views/mock';
import { SdpApiInterceptor } from './sdp-api-interceptor';

/**
 * Module that contains the SDP API interceptor
 */
@NgModule({
	imports: [
		MicroMockModule,
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: SdpApiInterceptor, multi: true },
	],
})
export class SdpApiModule {
}
