/* tslint:disable */
import { Injectable } from '@angular/core';
import { BaseConfiguration as __BaseConfiguration } from '../core/base-service';

/**
 * Global configuration for OSV services
 */
@Injectable({
	providedIn: 'root',
})
export class OSVConfiguration extends __BaseConfiguration {
}

export interface OSVConfigurationInterface {
	rootUrl?: string;
}
