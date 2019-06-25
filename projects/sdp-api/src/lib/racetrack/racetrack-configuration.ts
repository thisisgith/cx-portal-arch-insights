/* tslint:disable */
import { Injectable } from '@angular/core';
import { BaseConfiguration as __BaseConfiguration } from '../core/base-service';

/**
 * Global configuration for Racetrack services
 */
@Injectable({
  providedIn: 'root',
})
export class RacetrackConfiguration extends __BaseConfiguration {
}

export interface RacetrackConfigurationInterface {
  rootUrl?: string;
}