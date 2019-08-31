/**
 * Device attributes of a similar device
 */
export interface SimilarDevice {
	deviceId?: string;
	deviceName?: string;
	riskScore?: number;
	productFamily?: string;
	productId?: string;
	softwareVersion?: string;
	softwareType?: string;
	similarityScore?: number;
}
