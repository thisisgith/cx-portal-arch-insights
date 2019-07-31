/* tslint:disable */
import { Injectable } from '@angular/core';
import { BaseConfiguration as __BaseConfiguration } from '../core/base-service';

/**
 * Global configuration for Diagnostics services
 */
@Injectable({
  providedIn: 'root',
})
export class DiagnosticsConfiguration extends __BaseConfiguration {
}

export interface DiagnosticsConfigurationInterface {
  rootUrl?: string;
}
