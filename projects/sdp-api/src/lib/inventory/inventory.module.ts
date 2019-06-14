/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SdpApiModule } from '../sdp-api.module';
import { InventoryConfiguration, InventoryConfigurationInterface } from './inventory-configuration';

import { InventoryService } from './services/inventory.service';

/**
 * Provider for all Inventory services, plus InventoryConfiguration
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
    InventoryConfiguration,
    InventoryService
  ],
})
export class InventoryModule {
  static forRoot(customParams: InventoryConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: InventoryModule,
      providers: [
        {
          provide: InventoryConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
