/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ArchitectureConfiguration, ArchitectureConfigurationInterface } from './architecture-configuration';
import { ArchitectureService } from './services';

/**
 * Provider for all Architecture services, plus ArchitectureConfiguration
 */
@NgModule({
  declarations: [],
  providers: [
    ArchitectureConfiguration,
    ArchitectureService
  ],
})
export class ArchitectureModule {
  static forRoot(customParams: ArchitectureConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: ArchitectureModule,
      providers: [
        {
          provide: ArchitectureConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
