import { I18n } from '@cisco-ngx/cui-utils';

/**
 * A Reference to a button
 */
export interface EnvButtonRef {
	key: string;
	title: string;
	version: string;
}

/**
 * Function that returns a list of buttons
 * (must be a function and not a const because I18n needs to be loaded before the button list is
 * instantiated)
 * @returns EnvButtonRef[]
 */
export function getButtonList (): EnvButtonRef[] {
	return [
		{
			key: 'vsphere',
			title: I18n.get('_VMWareVSphereESXi_'),
			version: '5.5/6.0',
		},
		{
			key: 'vcenter',
			title: I18n.get('_VMWareVCenter_'),
			version: '6.0',
		},
		{
			key: 'vbox',
			title: I18n.get('_OracleVirtualBox_'),
			version: '5.2.30',
		},
	];
}
