import { TemplateRef } from '@angular/core';

/**
 * Interface repersents graph Model data
 */
export interface SyslogFilter {
	key: string;
	selected?: boolean;
	template?: TemplateRef<{ }>;
	title: string;
	loading: boolean;
	seriesData: {
		filter: string;
		label: string;
		selected: boolean;
		value: number;
	}[];
	view?: string[];
}
