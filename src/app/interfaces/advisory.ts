/**
 * The interface representing a PSIRT Advisory
 */
export interface Advisory {
	affected: number;
	affectedDevices?: string[];
	published: string;
	severity: number;
	title: string;
	related: string;
	current: string;
	workarounds?: string;
	summary: string;
}
