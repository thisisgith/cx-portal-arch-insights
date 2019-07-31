/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { DiagnosticsConfiguration, DiagnosticsConfigurationInterface } from './diagnostics-configuration';

import { DiagnosticsService } from './services/diagnostics.service';

/**
 * Provider for all Diagnostics services, plus DiagnosticsConfiguration
 */
@NgModule({
  declarations: [],
  providers: [
    DiagnosticsConfiguration,
    DiagnosticsService
  ],
})
export class DiagnosticsModule {
  static forRoot(customParams: DiagnosticsConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: DiagnosticsModule,
      providers: [
        {
          provide: DiagnosticsConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
