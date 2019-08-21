
import { NgModule, ModuleWithProviders } from '@angular/core';
import { AfmConfiguration, AfmConfigurationInterface } from './afm-configuration';

import { AfmService } from './services/afm.service';

/**
 * Provider for all Inventory services, plus InventoryConfiguration
 */
@NgModule({
	declarations: [],
	providers: [
		AfmConfiguration,
		AfmService,
	],
})

/**
 *  AfmModule
 */
export class AfmModule {

	/**
	 *
	 * this is the afm root module which will inject rootUrl
	 * @static
	 * @param customParams which is the type of AfmConfigurationInterface
	 * @returns ModuleWithProviders
	 * @memberof AfmModule
	 */
	public static forRoot (customParams: AfmConfigurationInterface): ModuleWithProviders {
		return {
			ngModule: AfmModule,
			providers: [
				{
					provide: AfmConfiguration,
					useValue: { rootUrl: customParams.rootUrl },
				},
			],
		};
	}
}
