/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { OSVConfiguration, OSVConfigurationInterface } from './osv-configuration';

import { OSVService } from './services/osv.service';

/**
 * Provider for all Osv services, plus OSVConfiguration	
 */
@NgModule({
	declarations: [],
	providers: [
		OSVConfiguration,
		OSVService
	],
})
export class OSVModule {
	static forRoot (customParams: OSVConfigurationInterface): ModuleWithProviders {
		return {
			ngModule: OSVModule,
			providers: [
				{
					provide: OSVConfiguration,
					useValue: { rootUrl: customParams.rootUrl }
				}
			]
		}
	}
}
