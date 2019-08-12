/* tslint:disable */
export interface TransactionStatusResponse {
  customerId?: string;
  transactionType?: string;
  status?: 'ACCEPTED' | 'RECEIVED' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILURE';
}
