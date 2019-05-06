import { I18n } from '@cisco-ngx/cui-utils';
import { severityMap } from './severities';

/**
 * The table columns
 */
export const tableColumns = [
	{
		key: 'severity',
		name: I18n.get('_Sev_'),
		sortable: true,
		sortDirection: 'asc',
		sorting: true,
		width: '60px',
	},
	{
		key: 'title',
		name: I18n.get('_Summary_'),
		sortable: true,
	},
	{
		key: 'affected',
		name: I18n.get('_ImpactedAssets_'),
		sortable: true,
	},
	{
		key: 'published',
		name: I18n.get('_Published_'),
		sortable: true,
	},
];

/**
 * The gauge mappings
 */
export const gauges = [
	{
		key: 'severity',
		title: severityMap.DANGER.title,
	},
	{
		key: 'severity',
		title: severityMap.WARNING.title,
	},
	{
		key: 'severity',
		title: severityMap['WARNING-ALT'].title,
	},
	{
		key: 'severity',
		title: severityMap.SUCCESS.title,
	},
	{
		key: 'severity',
		title: severityMap.INFO.title,
	},
];

/**
 * The title and color map for the severities
 */
export const advisorySeverities = {
	1: severityMap.DANGER,
	2: severityMap.WARNING,
	3: severityMap['WARNING-ALT'],
	4: severityMap.SUCCESS,
	5: severityMap.INFO,
};
