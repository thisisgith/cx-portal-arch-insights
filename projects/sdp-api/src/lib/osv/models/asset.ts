import { AssetRecommendations } from './asset-recommendations';

/* tslint:disable */
export interface OSVAsset {
	alert?: string;
	deployment: string;
	hostName: string;
	id: string;
	ipAddress: string;
	mdfId?: string;
	optimalVersion: string;
	productFamily: string;
	recommendations: AssetRecommendations[];
	recommAcceptedDate: string;
	recommendationCount?: number;
	swType: string;
	swVersion: string;
	statusUpdated?: boolean;
}
