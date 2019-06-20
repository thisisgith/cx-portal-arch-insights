/* tslint:disable */
import { Injectable } from '@angular/core';

/**
 * Global configuration for RacetrackContent services
 */
@Injectable({
  providedIn: 'root',
})
export class RacetrackContentConfiguration {
  rootUrl: string = 'https://sdp.cisco.com/api';
}

export interface RacetrackContentConfigurationInterface {
  rootUrl?: string;
}
