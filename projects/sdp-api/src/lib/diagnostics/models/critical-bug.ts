/* tslint:disable */
import { CDET } from './cdet';
export interface CriticalBug {
  severity?: 'notice' | 'info' | 'warning' | 'ok' | 'error' | 'high' | 'low' | 'critical';
  id?: string;
  hostname?: string;
  ipAddress?: string;
  description?: string;
  state?: 'new' | 'resolved' | 'verified' | 'duplicate' | 'closed';
  title?: string;
  publishedOn?: string;
  lastUpdated?: string;
  swVersion?: string;
  assetsImpacted?: number;
  cdets?: CDET;
}
