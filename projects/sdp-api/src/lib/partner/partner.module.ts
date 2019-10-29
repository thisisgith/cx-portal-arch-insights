/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { PartnerConfiguration, PartnerConfigurationInterface } from './partner-configuration';

import { PartnerInfoApiControllerService } from './services/partner-info-api-controller.service';
import { EmployeeCertificationControllerService } from './services/employee-certification-controller.service';
import { CiscoContactsApiControllerService } from './services/cisco-contacts-api-controller.service';
import { ContractControllerService } from './services/contract-controller.service';
import { GenericApiControllerService } from './services/generic-api-controller.service';
import { PartnerProfileControllerService } from './services/partner-profile-controller.service';
import { SpecializationApiControllerService } from './services/specialization-api-controller.service';
import { UserContractNotesControllerService } from './services/user-contract-notes-controller.service';

/**
 * Provider for all Partner services, plus PartnerConfiguration
 */
@NgModule({
  declarations: [],
  providers: [
    PartnerConfiguration,
    PartnerInfoApiControllerService,
    EmployeeCertificationControllerService,
    CiscoContactsApiControllerService,
    ContractControllerService,
    GenericApiControllerService,
    PartnerProfileControllerService,
    SpecializationApiControllerService,
    UserContractNotesControllerService
  ],
})
export class PartnerModule {
  static forRoot(customParams: PartnerConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: PartnerModule,
      providers: [
        {
          provide: PartnerConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
