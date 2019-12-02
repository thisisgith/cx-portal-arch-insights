/* tslint:disable */
import { Injectable } from '@angular/core';
import { BaseConfiguration as __BaseConfiguration } from '../core/base-service';

/**
 * Global configuration for Fault Component services
 */
@Injectable({
  providedIn: 'root',
})

/**
 * Fault Configuration
 */
export class FaultConfiguration extends __BaseConfiguration {
}

/**
 * Fault Configuration Interface
 */
export interface FaultConfigurationInterface {
  rootUrl?: string;
}
