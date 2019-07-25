/**
 * Interface representing data about a case open request,
 * data to be passed from case-open to the case-submitted component for display
 */
export interface CaseOpenData {
	caseNum: string;
	customerActivity: string;
	subtech: string;
	technology: string;
	title: string;
	description: string;
	problemArea: string;
	requestRma: boolean;
	severity: number;
	severityName: string;
}
