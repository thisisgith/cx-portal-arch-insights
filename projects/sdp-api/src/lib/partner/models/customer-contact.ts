/* tslint:disable */
import { CodeVO } from './code-vo';
export interface CustomerContact {
  contactId?: string;
  contractNumber?: string;
  customerId?: string;
  email?: CodeVO;
  firstName?: string;
  isPrimary?: boolean;
  lastName?: string;
  partnerId?: string;
  phone?: Array<CodeVO>;
  preferredContactMethod?: string;
  role?: CodeVO;
  source?: string;
  title?: CodeVO;
}
