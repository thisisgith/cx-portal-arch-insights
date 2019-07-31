/* tslint:disable */
import { TransactionRequestBody } from './transaction-request-body';
export interface PendingAction {
  customerId?: string;
  transactionId?: string;
  transactionType?: string;
  requestType?: string;
  requestBody?: TransactionRequestBody;
}
