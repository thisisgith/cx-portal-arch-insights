/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RiskMitigationConfiguration, RiskMitigationConfigurationInterface } from './risk-mitigation-configuration';

import { RiskMitigationService } from './services/risk-mitigation.service';

/**
 * Provider for all RiskMitigation services, plus RiskMitigationConfiguration
 */
@NgModule({
  declarations: [],
  providers: [
    RiskMitigationConfiguration,
    RiskMitigationService
  ],
})
export class RMModule {
  static forRoot(customParams: RiskMitigationConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: RMModule,
      providers: [
        {
          provide: RiskMitigationConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
