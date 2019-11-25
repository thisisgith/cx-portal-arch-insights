/* tslint:disable */
import { Injectable } from '@angular/core';
import { BaseConfiguration as __BaseConfiguration } from '../core/base-service';

/**
 * Global configuration for OrgUser services
 */
@Injectable({
  providedIn: 'root',
})
export class OrgUserConfiguration extends __BaseConfiguration {
}

export interface OrgUserConfigurationInterface {
  rootUrl?: string;
}
