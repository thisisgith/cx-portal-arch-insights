import { I18n } from '@cisco-ngx/cui-utils';

/**
 * The title and color map for the severities
 */
export const severityMap = {
	DANGER: {
		class: 'danger',
		color: '#e2231a',
		title: I18n.get('_Critical_'),
	},
	INFO: {
		class: 'info',
		color: '#017cad',
		title: I18n.get('_Info_'),
	},
	SUCCESS: {
		class: 'success',
		color: '#6ebe4a',
		title: I18n.get('_Success_'),
	},
	WARNING: {
		class: 'warning',
		color: '#fbab18',
		title: I18n.get('_High_'),
	},
	'WARNING-ALT': {
		class: 'warning-alt',
		color: '#ffcc00',
		title: I18n.get('_Medium_'),
	},
};

/**
 * A map that maps severity levels (numbers) to their text counterparts
 */
export const severityLevelMap = {
	1: severityMap.DANGER,
	2: severityMap.WARNING,
	3: severityMap['WARNING-ALT'],
	4: severityMap.SUCCESS,
	5: severityMap.INFO,
};
