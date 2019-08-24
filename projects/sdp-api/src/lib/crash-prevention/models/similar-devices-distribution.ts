export interface SimilarDevicesDistribution {
    customerId: string;
    softwares: Array<DeviceSoftwareDistribution>;
    productFamilies: Array<DeviceProductFamilyDistribution>;
    products: Array<DeviceProductDistribution>;
}

export interface DeviceSoftwareDistribution {
    softwareVersion: string;
    deviceCount: string;
}

export interface DeviceProductFamilyDistribution {
    productFamily: string;
    deviceCount: string;
}

export interface DeviceProductDistribution {
    productId: string;
    deviceCount: string;
}