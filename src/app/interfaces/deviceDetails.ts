/**
 * The interface representing a Device Details
 */
export interface DeviceDetails {
	_id: number;
	hostname: string;
	productId: string;
	productFamily: string;
	productSeries: string;
	ipAddress: string;
	serialNumber: string;
	swVersion: string;
	swType: string;
	sysName: string;
}
