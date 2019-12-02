/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetTaggingConfiguration, AssetTaggingConfigurationInterface } from './asset-tagging-configuration';
import { AssetTaggingService } from './services/asset-tagging.services';

/**
 * Ng module
 */
@NgModule({
	declarations: [],
	imports: [CommonModule],
	providers: [AssetTaggingConfiguration, AssetTaggingService],
})
export class AssetTaggingModules {
	public static forRoot (customParams: AssetTaggingConfigurationInterface): ModuleWithProviders {
		return {
			ngModule: AssetTaggingModules,
			providers: [
				{
					provide: AssetTaggingConfiguration,
					useValue: { rootUrl: customParams.rootUrl },
				},
			],
		};
	}
}
