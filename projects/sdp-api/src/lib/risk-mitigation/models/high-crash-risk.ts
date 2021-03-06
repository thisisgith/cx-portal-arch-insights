/* tslint:disable */
export interface HighCrashRiskDevices {

	active: boolean;
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

	neName: string;
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
	search: string;
	sort: string;
	globalRiskRank?: string;
	solution?: string;
	useCase?: string;
}

export interface HighCrashRiskDeviceCount{
	customerId: string;
	crashRiskDeviceCount?:HighCrashRiskDeviceTooltip;
	crashPredicted:boolean;

}

export interface HighCrashRiskDeviceTooltip {
		high?: number,
		med?: number,
		low?: number,
		notEvaluated?:number,
}
export interface BarGraphValues {
	role?:string,
	deviceCount?:number
}

