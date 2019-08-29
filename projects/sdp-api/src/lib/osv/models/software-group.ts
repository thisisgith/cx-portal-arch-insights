/* tslint:disable */
export interface SoftwareGroup {
	assetCount: number;
	customerId: number;
	deployment?: string;
	id: string;
	productFamily : string;
	productId: string;
	profileName: string;
	optimalVersion: string;
	swType
	swVersions: string[],
	recommendation: string;
}
