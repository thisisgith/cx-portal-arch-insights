/* tslint:disable */
import { RiskAsset } from './risk-asset';
import { RiskPagination } from './risk-pagination';

/**
 * The hardware in the inventory
 */
export interface RiskAssets {
  customerId?: string;
  data: Array<RiskAsset>;
  Pagination?: RiskPagination;
  deviceDetails?: Array<RiskAsset>;
}

export interface CrashHistoryDeviceCount {
	customerId?:string;
	neInstanceId?:string;
	solution?: string;
	useCase?: string;
}

export interface CrashHistoryDeviceList {
	customerId?: string;
	deviceId?: string;
	crashes?: Array<CrashHistoryData>;
}

export interface CrashHistoryData {
	resetReason?: string;
	timeStamp?: string;
}
