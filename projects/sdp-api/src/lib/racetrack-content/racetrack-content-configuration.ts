/* tslint:disable */
import { Injectable } from '@angular/core';
import { BaseConfiguration as __BaseConfiguration } from '../core/base-service';

/**
 * Global configuration for RacetrackContent services
 */
@Injectable({
  providedIn: 'root',
})
export class RacetrackContentConfiguration extends __BaseConfiguration {
}

export interface RacetrackContentConfigurationInterface {
  rootUrl?: string;
}
