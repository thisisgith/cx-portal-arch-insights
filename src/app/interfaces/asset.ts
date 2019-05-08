
/**
 * The interface representing an asset
 */
export interface Asset {
	_id: number;
	hostname: string;
	productId?: string;
	ipAddress?: string;
	serialNumber?: string;
	softwareType?: string;
	softwareVersion?: string;
	status?: boolean;
}
