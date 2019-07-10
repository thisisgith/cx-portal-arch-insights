/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ControlPointsConfiguration, ControlPointsConfigurationInterface } from './control-points-configuration';

import { ControlPointDeviceConnectivtyAPIService } from './services/control-point-device-connectivty-api.service';
import { ControlPointDeviceDiscoveryAPIService } from './services/control-point-device-discovery-api.service';
import { ControlPointIEHealthStatusAPIService } from './services/control-point-iehealth-status-api.service';
import { ControlPointIERegistrationAPIService } from './services/control-point-ieregistration-api.service';
import { ControlPointDevicePolicyAPIService } from './services/control-point-device-policy-api.service';
import { ControlPointDeviceDiscoveryAPIToRemoveInventoryService } from './services/control-point-device-discovery-apito-remove-inventory.service';

/**
 * Provider for all ControlPoints services, plus ControlPointsConfiguration
 */
@NgModule({
  declarations: [],
  providers: [
    ControlPointsConfiguration,
    ControlPointDeviceConnectivtyAPIService,
    ControlPointDeviceDiscoveryAPIService,
    ControlPointIEHealthStatusAPIService,
    ControlPointIERegistrationAPIService,
    ControlPointDevicePolicyAPIService,
    ControlPointDeviceDiscoveryAPIToRemoveInventoryService
  ],
})
export class ControlPointsModule {
  static forRoot(customParams: ControlPointsConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: ControlPointsModule,
      providers: [
        {
          provide: ControlPointsConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
