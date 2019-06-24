/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { InventoryConfiguration, InventoryConfigurationInterface } from './inventory-configuration';

import { InventoryService } from './services/inventory.service';

/**
 * Provider for all Inventory services, plus InventoryConfiguration
 */
@NgModule({
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
