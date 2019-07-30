/* tslint:disable */
import { Injectable } from '@angular/core';
import { BaseConfiguration as __BaseConfiguration } from '../core/base-service';

/**
 * Global configuration for Entitlement services
 */
@Injectable({
  providedIn: 'root',
})
export class EntitlementConfiguration extends __BaseConfiguration {
}

export interface EntitlementConfigurationInterface {
  rootUrl?: string;
}
