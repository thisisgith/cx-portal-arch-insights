/* tslint:disable */
export interface TransactionStatusResponse {
  customerId?: string;
  transactionId?: string;
  status?: 'ACCEPTED' | 'RECEIVED' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILURE';
}
