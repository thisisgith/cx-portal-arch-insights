/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { UserConfiguration, UserConfigurationInterface } from './user-configuration';

import { UserService } from './services/user.service';

/**
 * Provider for all User services, plus UserConfiguration
 */
@NgModule({
  declarations: [],
  providers: [
    UserConfiguration,
    UserService
  ],
})
export class UserModule {
  static forRoot(customParams: UserConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: UserModule,
      providers: [
        {
          provide: UserConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
