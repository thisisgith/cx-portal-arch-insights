/* tslint:disable */
export interface IListdevice {
	deviceDetail: IDeviceDetail[];
    customerId?: string;
  }

  export interface IDeviceDetail{
	deviceId?:string;
    deviceName?:string;
  }
  