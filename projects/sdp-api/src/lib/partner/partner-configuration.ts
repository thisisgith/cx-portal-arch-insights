/* tslint:disable */
import { Injectable } from '@angular/core';
import { BaseConfiguration as __BaseConfiguration } from '../core/base-service';

/**
 * Global configuration for Partner services
 */
@Injectable({
  providedIn: 'root',
})
export class PartnerConfiguration extends __BaseConfiguration {
}

export interface PartnerConfigurationInterface {
  rootUrl?: string;
}
