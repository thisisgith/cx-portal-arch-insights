import { OsvBug } from './bugs';
import { OsvPsirt } from './psrits';

/* tslint:disable */

export interface MachineRecommendations {
	bugs: OsvBug[];
	osType: string;
	psirts: OsvPsirt[];
	release: string;
	score: number;
}
