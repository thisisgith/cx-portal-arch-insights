/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ArchitectureReviewConfiguration, ArchitectureReviewConfigurationInterface } from './architecture-review-configuration';
import { ArchitectureReviewService } from './services';

/**
 * Provider for all Architecture services, plus ArchitectureConfiguration
 */
@NgModule({
  declarations: [],
  providers: [
    ArchitectureReviewConfiguration,
    ArchitectureReviewService
  ],
})
export class ArchitectureReviewModules {
  static forRoot(customParams: ArchitectureReviewConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: ArchitectureReviewModules,
      providers: [
        {
          provide: ArchitectureReviewConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
