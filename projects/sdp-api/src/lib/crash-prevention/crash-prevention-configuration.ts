/* tslint:disable */
import { Injectable } from '@angular/core';
import { BaseConfiguration as __BaseConfiguration } from '../core/base-service';

/**
 * Global configuration for Inventory services
 */
@Injectable({
  providedIn: 'root',
})
export class  CrashPreventionConfiguration extends __BaseConfiguration {
}
export interface CrashPreventionConfigurationInterface {
  rootUrl?: string;
}