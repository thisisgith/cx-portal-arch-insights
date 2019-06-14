/* tslint:disable */
import { Injectable } from '@angular/core';
import { BaseConfiguration as __BaseConfiguration } from '../core/base-service';

/**
 * Global configuration for ProductAlerts services
 */
@Injectable({
  providedIn: 'root',
})
export class ProductAlertsConfiguration extends __BaseConfiguration {
}

export interface ProductAlertsConfigurationInterface {
  rootUrl?: string;
}
