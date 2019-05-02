/**
 * Case Interface
 */
export interface Case {
	affected: number;
	customerActivity: string;
	description: string;
	id: string;
	lastUpdateDate: string;
	problemCodeName: string;
	severity: number;
	status: string;
	subTechnologyName: string;
	technologyName: string;
	title: string;
}
