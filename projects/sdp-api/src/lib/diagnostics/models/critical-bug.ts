/* tslint:disable */
export interface CriticalBug {
  id?: string;
  title?: string;
  description?: string;
  assetsImpacted?: number;
  severity?: string;
  state?: 'new' | 'resolved' | 'verified' | 'duplicate' | 'closed';
  publishedOn?: string;
  lastUpdated?: string;
}
