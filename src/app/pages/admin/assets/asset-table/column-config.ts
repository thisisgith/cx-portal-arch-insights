import { TemplateRef } from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';

enum TemplatePosition {
	DEVICE_NAME = 0,
	LAST_SCAN = 1,
	REACHABILITY_STATUS = 2,
	DATE = 3,
}

/**
 * Gets the column config
 * @param templates TemplateRef[]
 * @returns columnConfig
 */
export function getColumnConfig (templates: TemplateRef<any>[]) {
	return [
		{
			name: I18n.get('_Device_'),
			sortable: false,
			template: templates[TemplatePosition.DEVICE_NAME],
		},
		{
			key: 'ipAddress',
			name: I18n.get('_IPAddress_'),
			sortable: false,
		},
		{
			name: I18n.get('_LastScan_'),
			sortable: false,
			template: templates[TemplatePosition.LAST_SCAN],
		},
		{
			name: I18n.get('_CiscoDNACenterReachability_'),
			sortable: false,
			template: templates[TemplatePosition.REACHABILITY_STATUS],
		},
		{
			key: 'serialNumber',
			name: I18n.get('_SerialNumber_'),
			sortable: false,
		},
		{
			key: 'softwareType',
			name: I18n.get('_SoftwareType_'),
			sortable: false,
		},
		{
			key: 'softwareVersion',
			name: I18n.get('_SoftwareVersion_'),
			sortable: false,
		},
		{
			key: 'role',
			name: I18n.get('_Role_'),
			sortable: false,
		},
		{
			name: I18n.get('_ConnectedSince_'),
			sortable: false,
			template: templates[TemplatePosition.DATE],
		},
	];
}
