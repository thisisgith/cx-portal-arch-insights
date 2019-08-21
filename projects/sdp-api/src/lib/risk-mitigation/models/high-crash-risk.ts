/* tslint:disable */
export interface HighCrashRiskDevices {

	/**
   * Address of the device
   */
	deviceId: number;
		/**
   * Name of the device
   */
	deviceName: string;
		/**
   * global risk rank of the device
   */
	globalRiskRank: string;
		/**
   * Product family of the device
   */
	productFamily: string;
		/**
   * Product id for the device
   */
	productId: string;
		/**
   * Risk score of the device
   */
	riskScore: number;
		/**
   * Software type of the device
   */
	softwareType: string;
		/**
   * Software version of the device
   */
	softwareVersion: string;
}

export interface HighCrashRisk {
	count: number;
	customerId: number;
	devices:Array<HighCrashRiskDevices>;
}

export interface HighCrashRiskPagination {
	customerId: number;
	page: number;
	size:number;
	limit?:number;
}

export interface HighCrashRiskDeviceCount{
	customerId: string;
	crashRiskDeviceCount:number;
}
