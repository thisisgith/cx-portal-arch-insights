/* tslint:disable */
import { Injectable } from '@angular/core';
import { BaseConfiguration as __BaseConfiguration } from '../core/base-service';

/**
 * Global configuration for Email services
 */
@Injectable({
  providedIn: 'root',
})
export class EmailConfiguration extends __BaseConfiguration {
}

export interface EmailConfigurationInterface {
  rootUrl?: string;
}
