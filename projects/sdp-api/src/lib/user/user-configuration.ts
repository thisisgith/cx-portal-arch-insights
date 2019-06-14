/* tslint:disable */
import { Injectable } from '@angular/core';
import { BaseConfiguration as __BaseConfiguration } from '../core/base-service';

/**
 * Global configuration for User services
 */
@Injectable({
  providedIn: 'root',
})
export class UserConfiguration extends __BaseConfiguration {
}

export interface UserConfigurationInterface {
  rootUrl?: string;
}
