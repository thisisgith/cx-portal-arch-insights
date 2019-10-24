/* tslint:disable */
export interface IERegistrationResponseModel {
  applianceId?: string;
  errors?: Array<string>;
  ieSetupCompleted?: boolean;
  message?: string;
  registrationDate?: string;
  registrationFileUrl?: string;
  remoteNodeId?: string;
  remoteNodeName?: string;
  status?: number;
}
