import { AssetRecommendations } from './asset-recommendations';

/* tslint:disable */
export interface OSVAsset {
	deployment: string;
	hostName: string;
	id: string;
	ipAddress: string;
	optimalVersion: string;
	productFamily: string;
	recommendations: AssetRecommendations[];
	recommAcceptedDate: string;
	swType: string;
	swVersion: string;
	statusUpdated?: boolean;
}
