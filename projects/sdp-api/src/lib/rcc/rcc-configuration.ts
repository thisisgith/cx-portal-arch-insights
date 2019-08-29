/* tslint:disable */
import { Injectable } from '@angular/core';
import { BaseConfiguration as __BaseConfiguration } from '../core/base-service';

/**
 * Global configuration for Racetrack services
 */
@Injectable({
    providedIn: 'root',
})
export class RccConfiguration extends __BaseConfiguration {
}

export interface RccConfigurationInterface {
    rootUrl?: string;
}
