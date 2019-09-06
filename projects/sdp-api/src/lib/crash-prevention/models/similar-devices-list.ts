import { SimilarDevice } from './similar-device';

/**
 * Model for List of similar devices matching the given criteria.
 */
export interface SimilarDevicesList {
	customerId: string;
	count: number;
	similarDevices: SimilarDevice[];
}
