/* tslint:disable */
export interface IListdevice {
	deviceDetail: IDeviceDetail[];
	customerId?: string;
	productId?: string,
	crashPredicted?: boolean,
  }

  export interface IDeviceDetail{
	deviceId?:string;
	deviceName?:string;
	serialNumber?:string;
  }
