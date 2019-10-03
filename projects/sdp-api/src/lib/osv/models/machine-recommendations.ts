import { OsvBug } from './bugs';
import { OsvPsirt } from './psrits';
import { OsvSeverityTypes } from './severity-types';

/* tslint:disable */

export interface MachineRecommendations {
	accepted?: boolean;
	bugs: OsvBug[];
	name?: string;
	osType: string;
	postDate?: string;
	psirts: OsvPsirt[];
	release: string;
	swVersion?: string;
	score: any;
	bugFixed?: number;
	bugsExposed?: number;
	psirtExposed?: number;
	psirtFixed?: number;
	bugSeverity: OsvSeverityTypes;
	psirtSeverity: OsvSeverityTypes;
	bugSeriesData?: [],
	psirtSeriesData?: [],
	acceptedDate?: string;
	expectedProfileRisk?: any;
	resolvedBugsCount?: number;
	psirtResolvedCount?: number;
	totalBugsSeverity? : any;
	totalPsirtsSeverity? : any;
}
