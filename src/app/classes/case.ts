import { I18n } from '@cisco-ngx/cui-utils';
import { severityMap } from './severities';
import * as _ from 'lodash-es';

/**
 * The title and color map for the severities
 */
export const caseSeverities = {
	1: _.assignIn(
		{ title:  I18n.get('_Critical_') },
		_.pick(severityMap.DANGER, ['class', 'color'])),
	2: _.assignIn(
		{ title: I18n.get('_Degraded_') },
		_.pick(severityMap.WARNING, ['class', 'color'])),
	3: _.assignIn(
		{ title: I18n.get('_Impaired_') },
		_.pick(severityMap['WARNING-ALT'], ['class', 'color'])),
	4: _.assignIn(
		{ title: I18n.get('_Info_') },
		_.pick(severityMap.INFO, ['class', 'color'])),
};
