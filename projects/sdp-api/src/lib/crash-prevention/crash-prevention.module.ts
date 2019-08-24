/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CrashPreventionConfiguration, CrashPreventionConfigurationInterface } from './crash-prevention-configuration';
import { CrashPreventionService } from './services/crash-prevention.service';
import { FpIntelligenceService } from './services/fp-intelligence.service';

/**
 * Provider for all CrashPrevension services, plus CrashPreventionConfiguration
 */
@NgModule({
  declarations: [],
  providers: [
    CrashPreventionConfiguration,
    CrashPreventionService,
    FpIntelligenceService
  ],
})
export class CrashPreventionModule {
  static forRoot(customParams: CrashPreventionConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: CrashPreventionModule,
      providers: [
        {
          provide: CrashPreventionConfiguration,
          useValue: { rootUrl: customParams.rootUrl }
        }
      ]
    }
  }
}
