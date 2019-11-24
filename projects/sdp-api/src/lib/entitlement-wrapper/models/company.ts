/* tslint:disable */
import { Role } from './role';
export interface Company {
  accountType?: 'ALL' | 'CUSTOMER' | 'HOLDING' | 'VIRTUAL';
  companyId?: number;
  companyName?: string;
  domainIdentifier?: string;
  roleList?: Array<Role>;
}
