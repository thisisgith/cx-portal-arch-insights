/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ContractsConfiguration, ContractsConfigurationInterface } from './contracts-configuration';

import { ContractsService } from './services/contracts.service';

/**
 * Provider for all Contracts services, plus ContractsConfiguration
 */
@NgModule({
  declarations: [],
  providers: [
    ContractsConfiguration,
    ContractsService
  ],
})
export class ContractsModule {
  static forRoot(customParams: ContractsConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: ContractsModule,
      providers: [
        {
          provide: ContractsConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
