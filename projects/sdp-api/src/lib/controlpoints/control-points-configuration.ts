/* tslint:disable */
import { Injectable } from '@angular/core';
import { BaseConfiguration as __BaseConfiguration } from '../core/base-service';

/**
 * Global configuration for ControlPoints services
 */
@Injectable({
  providedIn: 'root',
})
export class ControlPointsConfiguration extends __BaseConfiguration {
}

export interface ControlPointsConfigurationInterface {
  rootUrl?: string;
}
