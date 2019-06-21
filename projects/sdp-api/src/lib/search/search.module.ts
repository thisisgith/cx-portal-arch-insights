/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { SearchConfiguration, SearchConfigurationInterface } from './search-configuration';

import { SearchService } from './services/search.service';

/**
 * Provider for all Search services, plus SearchConfiguration
 */
@NgModule({
  declarations: [],
  providers: [
    SearchConfiguration,
    SearchService
  ],
})
export class SearchModule {
  static forRoot(customParams: SearchConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: SearchModule,
      providers: [
        {
          provide: SearchConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
