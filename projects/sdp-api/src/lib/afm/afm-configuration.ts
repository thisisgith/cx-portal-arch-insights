/* tslint:disable */
import { Injectable } from '@angular/core';
import { BaseConfiguration as __BaseConfiguration} from '../core/base-service';


/**
 * Global configuration for Afm Component services
 */
@Injectable({
  providedIn: 'root',
})

export class AfmConfiguration extends __BaseConfiguration{
}

export interface AfmConfigurationInterface {
  rootUrl?: string;
}
