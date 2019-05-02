/**
 * Bug Interface
 */
export interface Bug {
	affected: number;
	affectedReleases: string[];
	conditions: string;
	id: string;
	knownFixedReleases: string[];
	lastUpdated: string;
	severity: number;
	status: string;
	symptom: string;
	title: string;
	workaround?: string;
}
