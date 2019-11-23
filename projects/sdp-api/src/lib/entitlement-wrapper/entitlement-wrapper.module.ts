/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { EntitlementWrapperConfiguration, EntitlementWrapperConfigurationInterface } from './entitlement-wrapper-configuration';

import { EntitlementWrapperService } from './services/entitlement-wrapper.service';

/**
 * Provider for all EntitlementWrapper services, plus EntitlementWrapperConfiguration
 */
@NgModule({
  declarations: [],
  providers: [
    EntitlementWrapperConfiguration,
    EntitlementWrapperService
  ],
})
export class EntitlementWrapperModule {
  static forRoot(customParams: EntitlementWrapperConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: EntitlementWrapperModule,
      providers: [
        {
          provide: EntitlementWrapperConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
