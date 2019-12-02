
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FaultConfiguration, FaultConfigurationInterface } from './fault-configuration';

import { FaultService } from './service/fault.service';

/**
 * Provider for all Inventory services, plus InventoryConfiguration
 */
@NgModule({
	declarations: [],
	providers: [
		FaultConfiguration,
		FaultService,
	],
})

/**
 *  FaultDataModule
 */
export class FaultDataModule {

	/**
	 *
	 * this is the fault root module which will inject rootUrl
	 * @static
	 * @param customParams which is the type of FaultConfigurationInterface
	 * @returns ModuleWithProviders
	 * @memberof FaultDataModule
	 */
	public static forRoot (customParams: FaultConfigurationInterface): ModuleWithProviders {
		return {
			ngModule: FaultDataModule,
			providers: [
				{
					provide: FaultConfiguration,
					useValue: { rootUrl: customParams.rootUrl },
				},
			],
		};
	}
}
