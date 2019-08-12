/* tslint:disable */
export interface ScanRequestStatus {
  customerId?: string;
  transactionId?: string;
  status?: 'ACCEPTED' | 'RECEIVED' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILURE';
}
