/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RacetrackConfiguration, RacetrackConfigurationInterface } from './racetrack-configuration';

import { RacetrackService } from './services/racetrack.service';

/**
 * Provider for all Racetrack services, plus RacetrackConfiguration
 */
@NgModule({
  declarations: [],
  providers: [
    RacetrackConfiguration,
    RacetrackService
  ],
})
export class RacetrackModule {
  static forRoot(customParams: RacetrackConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: RacetrackModule,
      providers: [
        {
          provide: RacetrackConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
