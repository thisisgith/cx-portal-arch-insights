/* tslint:disable */
export interface CustomerContactRequest {
  contactId?: string;
  contractNumber?: string;
  customerId?: string;
  email?: string;
  firstName?: string;
  isPrimary?: boolean;
  lastName?: string;
  partnerId?: string;
  phone?: Array<string>;
  preferredContactMethod?: string;
  role?: string;
  source?: string;
  title?: string;
}
