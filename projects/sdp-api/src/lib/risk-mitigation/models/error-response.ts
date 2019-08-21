/* tslint:disable */
export interface ErrorResponse {
  status: number;
  message: string;
  reason: {errorCode?: string, errorInfo?: string};
}
