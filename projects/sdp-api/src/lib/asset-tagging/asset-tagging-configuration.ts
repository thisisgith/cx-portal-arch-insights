/* tslint:disable */
import { Injectable } from '@angular/core';
import { BaseConfiguration as __BaseConfiguration } from '../core/base-service';

/**
 * Global configuration for Contracts services
 */
@Injectable({
  providedIn: 'root',
})
export class AssetTaggingConfiguration extends __BaseConfiguration {
}

export interface AssetTaggingConfigurationInterface {
  rootUrl?: string;
}
