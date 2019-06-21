/* tslint:disable */
import { Injectable } from '@angular/core';

/**
 * Global configuration for Contracts services
 */
@Injectable({
  providedIn: 'root',
})
export class ContractsConfiguration {
  rootUrl: string = 'https://sdp.cisco.com/api';
}

export interface ContractsConfigurationInterface {
  rootUrl?: string;
}
