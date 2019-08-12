/* tslint:disable */
import { Injectable } from '@angular/core';
import { BaseConfiguration as __BaseConfiguration } from '../core/base-service';

/**
 * Global configuration for Feedback services
 */
@Injectable({
  providedIn: 'root',
})
export class FeedbackConfiguration extends __BaseConfiguration {
}

export interface FeedbackConfigurationInterface {
  rootUrl?: string;
}
