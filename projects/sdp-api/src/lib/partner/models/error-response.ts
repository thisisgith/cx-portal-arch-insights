/* tslint:disable */
import { Reason } from './reason';
export interface ErrorResponse {
  message?: string;
  reason?: Reason;
  status?: number;
}
