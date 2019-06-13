/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ContractsConfiguration, ContractsConfigurationInterface } from './contracts-configuration';

import { ContractsService } from './services/contracts.service';

/**
 * Provider for all Contracts services, plus ContractsConfiguration
 */
@NgModule({
  imports: [
    HttpClientModule
  ],
  exports: [
    HttpClientModule
  ],
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
