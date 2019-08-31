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
	statusUpdated?: boolean;
	swType
	swVersions: string[],
	recommendation: string;
	recommAcceptedDate?: string;
}
