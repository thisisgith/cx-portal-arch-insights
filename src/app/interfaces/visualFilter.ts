import { TemplateRef } from '@angular/core';

/**
 * Interface representing our visual filters
 */
export interface VisualFilter {
	displayed?: boolean;
	key: string;
	selected?: boolean;
	template?: TemplateRef<{ }>;
	title: string;
	loading: boolean;
	seriesData: {
		filter: string,
		label: string,
		selected: boolean,
		value: number,
	}[];
}
