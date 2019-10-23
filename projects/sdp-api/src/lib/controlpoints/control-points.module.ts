/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ControlPointsConfiguration, ControlPointsConfigurationInterface } from './control-points-configuration';

import { ControlPointModifyCollectionPolicyAPIService } from './services/control-point-modify-collection-policy-api.service';
import { ControlPointDeviceConnectivtyAPIService } from './services/control-point-device-connectivty-api.service';
import { ControlPointDeviceDiscoveryAPIService } from './services/control-point-device-discovery-api.service';
import { ControlPointIERegistrationAPIService } from './services/control-point-ieregistration-api.service';
import { ControlPointIEHealthStatusAPIService } from './services/control-point-iehealth-status-api.service';
import { ControlPointDevicePolicyAPIService } from './services/control-point-device-policy-api.service';
import { ControlPointLicenseAPIService } from './services/control-point-license-api.service';
import { ControlPointAdminSettingsAPIService } from './services/control-point-admin-settings-api.service';

/**
 * Provider for all ControlPoints services, plus ControlPointsConfiguration
 */
@NgModule({
  declarations: [],
  providers: [
    ControlPointsConfiguration,
    ControlPointModifyCollectionPolicyAPIService,
    ControlPointDeviceConnectivtyAPIService,
    ControlPointDeviceDiscoveryAPIService,
    ControlPointIERegistrationAPIService,
    ControlPointIEHealthStatusAPIService,
    ControlPointDevicePolicyAPIService,
    ControlPointLicenseAPIService,
    ControlPointAdminSettingsAPIService
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
