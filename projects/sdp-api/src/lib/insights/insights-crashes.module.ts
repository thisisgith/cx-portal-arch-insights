/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { InsightsCrashesService } from './services';
import { InsightsCrashesConfiguration, InsightsCrashesConfigurationInterface } from './insights-crashes-configuration';

/**
 * Provider for all ProductAlerts services, plus ProductAlertsConfiguration
 */
@NgModule({
  declarations: [],
  providers: [
    InsightsCrashesConfiguration,
    InsightsCrashesService
  ],
})
export class InsightsCrashesModule {
  static forRoot(customParams: InsightsCrashesConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: InsightsCrashesModule,
      providers: [
        {
          provide: InsightsCrashesConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
