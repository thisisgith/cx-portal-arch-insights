/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { EntitlementConfiguration, EntitlementConfigurationInterface } from './entitlement-configuration';

import { EntitlementService } from './services/entitlement.service';

/**
 * Provider for all Entitlement services, plus EntitlementConfiguration
 */
@NgModule({
  declarations: [],
  providers: [
    EntitlementConfiguration,
    EntitlementService
  ],
})
export class EntitlementModule {
  static forRoot(customParams: EntitlementConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: EntitlementModule,
      providers: [
        {
          provide: EntitlementConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
