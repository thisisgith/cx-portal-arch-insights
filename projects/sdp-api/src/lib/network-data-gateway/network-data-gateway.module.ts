/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { NetworkDataGatewayConfiguration, NetworkDataGatewayConfigurationInterface } from './network-data-gateway-configuration';

import { NetworkDataGatewayService } from './services/network-data-gateway.service';

/**
 * Provider for all NetworkDataGateway services, plus NetworkDataGatewayConfiguration
 */
@NgModule({
  declarations: [],
  providers: [
    NetworkDataGatewayConfiguration,
    NetworkDataGatewayService
  ],
})
export class NetworkDataGatewayModule {
  static forRoot(customParams: NetworkDataGatewayConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: NetworkDataGatewayModule,
      providers: [
        {
          provide: NetworkDataGatewayConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
