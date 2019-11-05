import { AssetRecommendationsResponse } from './asset-recommendations-response';
import { MachineRecommendations } from './machine-recommendations';
import { ExpertRecommendations } from './expert-recommendations';
export interface ProfileRecommendationsResponse {
	recommAcceptedDate?: string;
	recommendations: AssetRecommendationsResponse;
	recommendationSummaries? : MachineRecommendations[];
	expertRecommendations?: ExpertRecommendations[];
}
