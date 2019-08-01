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

/**
 * The file extension to icon and label map for case files
 */
export const caseFileIcons = {
	'application/pdf': { icon: 'icon-file-pdf-o', label: 'PDF' },
	'application/x-tar': { icon: 'icon-file-archive-o', label: 'Archive' },
	'application/xls': { icon: 'icon-file-excel-o', label: 'Excel (csv)' },
	default: { icon: 'icon-file', label: 'File' },
	'image/jpeg': { icon: 'icon-file-image-o', label: 'Image (jpeg)' },
	'image/png': { icon: 'icon-file-image-o', label: 'Image (png)' },
	'text/csv': { icon: 'icon-file-excel-o', label: 'Excel (csv)' },
	'text/plain': { icon: 'icon-file-text-o', label: 'Plain Text' },
};
export enum CaseRequestType {
	Diagnose = 'Diagnose and Fix my Problem',
	RMA = 'Replace my Product',
}
