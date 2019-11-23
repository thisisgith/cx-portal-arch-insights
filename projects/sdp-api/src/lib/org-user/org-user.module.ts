/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { OrgUserConfiguration, OrgUserConfigurationInterface } from './org-user-configuration';

import { OrgUserService } from './services/org-user.service';

/**
 * Provider for all OrgUser services, plus OrgUserConfiguration
 */
@NgModule({
  declarations: [],
  providers: [
    OrgUserConfiguration,
    OrgUserService
  ],
})
export class OrgUserModule {
  static forRoot(customParams: OrgUserConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: OrgUserModule,
      providers: [
        {
          provide: OrgUserConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
