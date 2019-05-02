/**
 * Announcement Interface
 */
export interface Announcement {
	affected?: number;
	expiration: string;
	migration?: string;
	summary: string;
	timeline: {
		date: string;
		past?: boolean;
		title: string;
	}[];
	title: string;
	type: string;
}
