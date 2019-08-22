/* tslint:disable */
import { Individual } from './individual';
import { Account } from './account';
export interface User {
  name?: string;
  customerId?: string;
  individual?: Individual;
  account?: Account;
}
