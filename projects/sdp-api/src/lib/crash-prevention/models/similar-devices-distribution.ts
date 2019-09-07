/**
 * Similar devices distribution in different categories for the given criteria.
 */
export interface SimilarDevicesDistribution {
	customerId: string;
	softwares: DeviceSoftwareDistribution[];
	productFamilies: DeviceProductFamilyDistribution[];
	products: DeviceProductDistribution[];
}

/**
 * Similar devices distribution in different software versions.
 */
export interface DeviceSoftwareDistribution {
	softwareVersion: string;
	deviceCount: string;
}

/**
 * Similar devices distribution across different product families.
 */
export interface DeviceProductFamilyDistribution {
	productFamily: string;
	deviceCount: string;
}

/**
 * Similar devices distribution across different product types.
 */
export interface DeviceProductDistribution {
	productId: string;
	deviceCount: string;
}
