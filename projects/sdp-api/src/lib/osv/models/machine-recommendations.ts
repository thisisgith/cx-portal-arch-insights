import { OsvBug } from './bugs';
import { OsvPsirt } from './psrits';
import { OsvField } from './field';
import { OsvSeverityTypes } from './severity-types';

/* tslint:disable */

export interface MachineRecommendations {
	accepted?: boolean;
	bugs: OsvBug[];
	name?: string;
	osType: string;
	postDate?: string;
	psirts: OsvPsirt[];
	fns: OsvField[];
	release: string;
	swVersion?: string;
	score: any;
	bugFixed?: number;
	bugsExposed?: number;
	psirtExposed?: number;
	fieldsExposed?: number;
	psirtFixed?: number;
	bugSeverity: OsvSeverityTypes;
	psirtSeverity: OsvSeverityTypes;
	bugSeriesData?: [],
	psirtSeriesData?: [],
	fieldsSeriesData?: [],
	acceptedDate?: string;
	expectedProfileRisk?: any;
	resolvedBugsCount?: number;
	resolvedFieldsCount?: number;
	psirtResolvedCount?: number;
	totalBugsSeverity? : any;
	totalPsirtsSeverity? : any;
	totalFieldsSeverity?: any;
	openBugsCount?: number;
	openFieldsCount?: number;
	newOpenBugsCount?: number;
	newOpenFieldsCount?: number;
	openPsirtCount?: number;
	newOpenPsirtCount?: number;
}
