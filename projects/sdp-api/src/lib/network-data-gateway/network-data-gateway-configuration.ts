/* tslint:disable */
import { Injectable } from '@angular/core';
import { BaseConfiguration as __BaseConfiguration } from '../core/base-service';

/**
 * Global configuration for NetworkDataGateway services
 */
@Injectable({
  providedIn: 'root',
})
export class NetworkDataGatewayConfiguration extends __BaseConfiguration {
}

export interface NetworkDataGatewayConfigurationInterface {
  rootUrl?: string;
}
