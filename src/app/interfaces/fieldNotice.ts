/**
 * Field Notice Interface
 */
export interface FieldNotice {
	affected: number;
	current: string;
	published: string;
	related?: string;
	summary: string;
	title: string;
	workarounds?: string;
}
