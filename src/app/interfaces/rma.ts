/**
 * RMA Interface
 */
export interface RMA {
	affected: number;
	affectedAssets: string[];
	id: string;
	status: string;
	submitted: string;
	summary: string;
	timeline: {
		date: string;
		past?: boolean;
		title: string;
	}[];
}
