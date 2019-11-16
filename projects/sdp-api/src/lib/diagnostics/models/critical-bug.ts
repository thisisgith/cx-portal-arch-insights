/* tslint:disable */
import { ICType } from './ictype';
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
  icType?: ICType;
}
