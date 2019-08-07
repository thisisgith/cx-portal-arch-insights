/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { EmailConfiguration, EmailConfigurationInterface } from './email-configuration';

import { EmailControllerService } from './services/email-controller.service';

/**
 * Provider for all Email services, plus EmailConfiguration
 */
@NgModule({
  declarations: [],
  providers: [
    EmailConfiguration,
    EmailControllerService
  ],
})
export class EmailModule {
  static forRoot(customParams: EmailConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: EmailModule,
      providers: [
        {
          provide: EmailConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
