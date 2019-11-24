/* tslint:disable */
import { Injectable } from '@angular/core';
import { BaseConfiguration as __BaseConfiguration } from '../core/base-service';

/**
 * Global configuration for EntitlementWrapper services
 */
@Injectable({
  providedIn: 'root',
})
export class EntitlementWrapperConfiguration extends __BaseConfiguration {
}

export interface EntitlementWrapperConfigurationInterface {
  rootUrl?: string;
}
