import { AssetRecommendationsResponse } from './asset-recommendations-response';
import { MachineRecommendations } from './machine-recommendations';
export interface ProfileRecommendationsResponse {
	recommAcceptedDate?: string;
	recommendations: AssetRecommendationsResponse;
	recommendationSummaries? : MachineRecommendations[];
}
