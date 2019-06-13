/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SdpApiModule } from '../sdp-api.module';
import { SearchConfiguration, SearchConfigurationInterface } from './search-configuration';

import { SearchService } from './services/search.service';

/**
 * Provider for all Search services, plus SearchConfiguration
 */
@NgModule({
  imports: [
    HttpClientModule,
    SdpApiModule,
  ],
  exports: [
    HttpClientModule
  ],
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
