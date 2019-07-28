import { DeploymentStatusCount } from './deployment-status-count';
import { AssetTypeCount } from './asset-type-count';

/* tslint:disable */
export interface SummaryResponse {
	assets: number;
	versions: number;
	profiles: number;
	asset_profile: AssetTypeCount;
	deployment: DeploymentStatusCount;
}
