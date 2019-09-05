import { OsvBug } from './bugs';
import { OsvPsirt } from './psrits';
import { OsvSeverity } from './osv-severity';

/* tslint:disable */

export interface MachineRecommendations {
	accepted?: boolean;
	bugs: OsvBug[];
	name?: string;
	osType: string;
	postDate?: string;
	psirts: OsvPsirt[];
	release: string;
	score: number;
	bugFixed: number;
	bugsExposed?: number;
	psirtExposed?: number;
	psirtFixed: number;
	bugSeverity: OsvSeverity;
	psirtSeverity: OsvSeverity;
	bugSeriesData?: [],
	psritSeriesData?: []
}
