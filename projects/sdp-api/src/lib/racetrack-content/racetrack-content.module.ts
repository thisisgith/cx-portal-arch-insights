/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RacetrackContentConfiguration, RacetrackContentConfigurationInterface } from './racetrack-content-configuration';

import { RacetrackContentService } from './services/racetrack-content.service';

/**
 * Provider for all RacetrackContent services, plus RacetrackContentConfiguration
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
    RacetrackContentConfiguration,
    RacetrackContentService
  ],
})
export class RacetrackContentModule {
  static forRoot(customParams: RacetrackContentConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: RacetrackContentModule,
      providers: [
        {
          provide: RacetrackContentConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
