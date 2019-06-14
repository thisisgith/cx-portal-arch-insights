/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ProductAlertsConfiguration, ProductAlertsConfigurationInterface } from './product-alerts-configuration';

import { ProductAlertsService } from './services/product-alerts.service';

/**
 * Provider for all ProductAlerts services, plus ProductAlertsConfiguration
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
    ProductAlertsConfiguration,
    ProductAlertsService
  ],
})
export class ProductAlertsModule {
  static forRoot(customParams: ProductAlertsConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: ProductAlertsModule,
      providers: [
        {
          provide: ProductAlertsConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
