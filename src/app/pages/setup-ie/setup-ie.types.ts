/**
 * Enum for ovaSelection query param
 */
export enum Selection {
	VBOX = 'vbox',
	VCENTER = 'vcenter',
	VSPHERE = 'vsphere',
}

/**
 * Represents the 3 possible sets of slides, OVA, vcenter or IE
 */
export enum SlideSet {
	IE = 'ie',
	OVA = 'ova',
	SYSLOG = 'syslog',
	VBOX = 'vbox',
	VCENTER = 'vcenter',
}

/**
 * Represents slide text/image content
 */
export interface Slide {
	buttonText: string;
	content: string;
	src: string;
	stepLabel: string;
	stepNum: number;
	type: 'image' | 'video';
}
