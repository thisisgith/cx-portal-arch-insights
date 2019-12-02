import { DeploymentStatusCount } from './deployment-status-count';
import { AssetTypeCount } from './asset-type-count';
import { RecommendationTypeCount } from './recommendation-type-count';
import { RecommendationStatusCount } from './recommendation-status-count';


/* tslint:disable */
export interface SummaryResponse {
	assets: number;
	versions: number;
	profiles: number;
	asset_profile: AssetTypeCount;
	deployment: DeploymentStatusCount;
	recommendations?: RecommendationTypeCount;
	recommendation_status?: RecommendationStatusCount;
}
