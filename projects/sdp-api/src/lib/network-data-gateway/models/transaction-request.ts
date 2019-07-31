/* tslint:disable */
import { TransactionRequestBody } from './transaction-request-body';
export interface TransactionRequest {
  transactionType?: string;
  requestType?: string;
  customerId?: string;
  srNumber?: string;
  neCount?: number;
  applianceId?: string;
  remoteNodeId?: string;
  requestBody?: TransactionRequestBody;
}
