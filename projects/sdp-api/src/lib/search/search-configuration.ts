/* tslint:disable */
import { Injectable } from '@angular/core';
import { BaseConfiguration as __BaseConfiguration } from '../core/base-service';

/**
 * Global configuration for Search services
 */
@Injectable({
  providedIn: 'root',
})
export class SearchConfiguration extends __BaseConfiguration {
}

export interface SearchConfigurationInterface {
  rootUrl?: string;
}
