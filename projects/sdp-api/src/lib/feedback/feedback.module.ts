/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FeedbackConfiguration, FeedbackConfigurationInterface } from './feedback-configuration';

import { FeedbackService } from './services/feedback.service';

/**
 * Provider for all Feedback services, plus FeedbackConfiguration
 */
@NgModule({
  declarations: [],
  providers: [
    FeedbackConfiguration,
    FeedbackService
  ],
})
export class FeedbackModule {
  static forRoot(customParams: FeedbackConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: FeedbackModule,
      providers: [
        {
          provide: FeedbackConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
