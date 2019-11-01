/* tslint:disable */
export interface SoftwareGroup {
	assetCount: number;
	customerId: number;
	currentOSVersion?: string;
	deployment?: string;
	id: string;
	productFamily : string;
	productId: string;
	profileName: string;
	optimalVersion: string;
	statusUpdated?: boolean;
	swType
	swVersions: string[],
	recommendation: string;
	recommendationStatus?: string;
	recommAcceptedDate?: string;
}
