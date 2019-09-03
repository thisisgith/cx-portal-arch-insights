import {
	Asset,
	CriticalBug,
	FieldNoticeBulletin,
	NetworkElement,
	SecurityAdvisoryBulletin,
} from '@sdp-api';
import { I18n } from '@cisco-ngx/cui-utils';

import { AdvisoryType } from '@interfaces';

import * as _ from 'lodash-es';

/**
 * Type representing list of field display names and keys inside the data
 */
type Fields = {
	displayName: string;
	key: string;
}[];

/**
 * Utility class for building case summary/note from a security advisory's
 * details and related asset details.
 */
export class CaseNoteBuilder {

	/**
	 * Fields to use for filling out security advisory note
	 */
	private securityAdvisoryFields: Fields = [
		{
			displayName: I18n.get('_URL_'),
			key: 'URL',
		},
		{
			displayName: I18n.get('_DefectId_'),
			key: 'advisoryId',
		},
		{
			displayName: I18n.get('_Severity_'),
			key: 'severity',
		},
		{
			displayName: I18n.get('_CVEId_'),
			key: 'cveId',
		},
		{
			displayName: I18n.get('_CVSSBaseScore_'),
			key: 'cvssBaseScore',
		},
		{
			displayName: I18n.get('_CVSSTemporalScore_'),
			key: 'cvssTemporalScore',
		},
		{
			displayName: I18n.get('_FirstPublished_'),
			key: 'bulletinFirstPublished',
		},
	];

	/**
	 * Fields to use for filling out field notice note
	 */
	private fieldNoticeFields: Fields = [
		{
			displayName: I18n.get('_URL_'),
			key: 'URL',
		},
		{
			displayName: I18n.get('_FieldNoticeID_'),
			key: 'fieldNoticeId',
		},
		{
			displayName: I18n.get('_FieldNoticeType_'),
			key: 'fieldNoticeType',
		},
		{
			displayName: I18n.get('_Status_'),
			key: 'status',
		},
	];

	/**
	 * Fields to use for filling out security advisory note
	 */
	private bugFields: Fields = [
	 	{
			displayName: I18n.get('_Title_'),
			key: 'title',
		},
		{
			displayName: I18n.get('_Description_'),
			key: 'description',
		},
		{
			displayName: I18n.get('_Severity_'),
			key: 'severity',
		},
		{
			displayName: I18n.get('_PublishedOn_'),
			key: 'publishedOn',
		},
	];

	/**
	 * Build a note from proivded details
	 * @param type Type of advisory (SA, FN, Critical Bug)
	 * @param advisory The advisory details
	 * @param assets associtated assets
	 * @returns string with note
	 */
	public buildNote (
		type: AdvisoryType,
		advisory: SecurityAdvisoryBulletin | FieldNoticeBulletin | CriticalBug,
		assets?: (Asset | NetworkElement)[],
	) {
		let fields: Fields;
		let title: string;
		const outText: string[] = [];
		switch (type) {
			case 'security':
				title = I18n.get('_SecurityAdvisory_');
				fields = this.securityAdvisoryFields;
				break;
			case 'field':
				title = I18n.get('_FieldNotice_');
				fields = this.fieldNoticeFields;
				break;
			case 'bug':
				title = I18n.get('_CriticalBug_');
				fields = this.bugFields;
				break;
		}
		outText.push(`${I18n.get('_Event_')}: ${title}`);
		fields.forEach(f => {
			outText.push(`${f.displayName}: ${_.get(advisory, f.key, '')}`);
		});
		if (assets && assets.length > 1) {
			outText.push(`${I18n.get('_AdditionalAssetSerialNumbers_')}:`);
			assets.slice(1)
			.forEach(asset => {
				outText.push(asset.serialNumber);
			});
		}

		return outText.join('\n');
	}
}
