import { NgModule, ModuleWithProviders } from '@angular/core';
import {
	CrashPreventionConfiguration,
	CrashPreventionConfigurationInterface,
} from './crash-prevention-configuration';
import { CrashPreventionService } from './services/crash-prevention.service';
import { FpIntelligenceService } from './services/fp-intelligence.service';
import { MlVisualizationService } from './services/ml-visualization.service';

/**
 * Provider for all CrashPrevension services, plus CrashPreventionConfiguration
 */
@NgModule({
	declarations: [],
	providers: [
		CrashPreventionConfiguration,
		CrashPreventionService,
		FpIntelligenceService,
		MlVisualizationService,
	]
})

export class CrashPreventionModule {
	/**
	 * CrashPrevention module configurations
	 * @param customParams CrashPrevention configurations
	 * @returns Provider for all CrashPrevension services
	 */
	public static forRoot (
		customParams: CrashPreventionConfigurationInterface,
	): ModuleWithProviders {
		return {
			ngModule: CrashPreventionModule,
			providers: [
				{
					provide: CrashPreventionConfiguration,
					useValue: { rootUrl: customParams.rootUrl }
				}
			]
		};
	}
}
