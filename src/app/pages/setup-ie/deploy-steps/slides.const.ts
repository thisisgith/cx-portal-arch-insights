import { I18n } from '@cisco-ngx/cui-utils';
import { Selection, Slide, SlideSet } from '../setup-ie.types';
import * as _ from 'lodash-es';

/**
 * Slides for OVA setup in vSphere
 */
const ovaSlides: Slide[] = [
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SetupInstruction_1A_'),
		src: 'assets/img/setup-ie/FinalThickClient/1A_Launch_the_client.mp4',
		stepLabel: I18n.get('_VirtualMachine_'),
		stepNum: 2,
		type: 'video',
	},
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SetupInstruction_2A_'),
		src: 'assets/img/setup-ie/FinalThickClient/2a_Browse.mp4',
		stepLabel: I18n.get('_VirtualMachine_'),
		stepNum: 2,
		type: 'video',
	},
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SetupInstruction_3A_'),
		src: 'assets/img/setup-ie/FinalThickClient/3a_Verify.mp4',
		stepLabel: I18n.get('_VirtualMachine_'),
		stepNum: 2,
		type: 'video',
	},
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SetupInstruction_4A_'),
		src: 'assets/img/setup-ie/FinalThickClient/4a_Confirm.mp4',
		stepLabel: I18n.get('_VirtualMachine_'),
		stepNum: 2,
		type: 'video',
	},
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SetupInstruction_5A_'),
		src: 'assets/img/setup-ie/FinalThickClient/5a_Confirm.mp4',
		stepLabel: I18n.get('_VirtualMachine_'),
		stepNum: 2,
		type: 'video',
	},
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SetupInstruction_6A_'),
		src: 'assets/img/setup-ie/FinalThickClient/6a_Check.mp4',
		stepLabel: I18n.get('_VirtualMachine_'),
		stepNum: 2,
		type: 'video',
	},
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SetupInstruction_7A_'),
		src: 'assets/img/setup-ie/FinalThickClient/7a_Wait.mp4',
		stepLabel: I18n.get('_VirtualMachine_'),
		stepNum: 2,
		type: 'video',
	},
];

/**
 * Slides for vbox setup in vSphere
 */
const vboxSlides: Slide[] = [
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SetupInstruction_1C_'),
		src: 'assets/img/setup-ie/FinalVirtualBox/1C_Launch.mp4',
		stepLabel: I18n.get('_VirtualMachine_'),
		stepNum: 2,
		type: 'video',
	},
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SetupInstruction_2C_'),
		src: 'assets/img/setup-ie/FinalVirtualBox/2C_Browse.mp4',
		stepLabel: I18n.get('_VirtualMachine_'),
		stepNum: 2,
		type: 'video',
	},
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SetupInstruction_3C_'),
		src: 'assets/img/setup-ie/FinalVirtualBox/3C_Wait.mp4',
		stepLabel: I18n.get('_VirtualMachine_'),
		stepNum: 2,
		type: 'video',
	},
];

/**
 * Slides for VCenter setup
 */
const vCenterSlides: Slide[] = [
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SetupInstruction_1B_'),
		src: 'assets/img/setup-ie/FinalWebClient/1B_Launch.mp4',
		stepLabel: I18n.get('_VirtualMachine_'),
		stepNum: 2,
		type: 'video',
	},
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SetupInstruction_2B_'),
		src: 'assets/img/setup-ie/FinalWebClient/2B_Deploy.mp4',
		stepLabel: I18n.get('_VirtualMachine_'),
		stepNum: 2,
		type: 'video',
	},
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SetupInstruction_3B_'),
		src: 'assets/img/setup-ie/FinalWebClient/3B_Browse.mp4',
		stepLabel: I18n.get('_VirtualMachine_'),
		stepNum: 2,
		type: 'video',
	},
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SetupInstruction_4B_'),
		src: 'assets/img/setup-ie/FinalWebClient/4B_VirtualMachine.mp4',
		stepLabel: I18n.get('_VirtualMachine_'),
		stepNum: 2,
		type: 'video',
	},
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SetupInstruction_5B_'),
		src: 'assets/img/setup-ie/FinalWebClient/5B_ConfirmStandard.mp4',
		stepLabel: I18n.get('_VirtualMachine_'),
		stepNum: 2,
		type: 'video',
	},
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SetupInstruction_6B_'),
		src: 'assets/img/setup-ie/FinalWebClient/6B_ConfirmThin.mp4',
		stepLabel: I18n.get('_VirtualMachine_'),
		stepNum: 2,
		type: 'video',
	},
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SetupInstruction_7B_'),
		src: 'assets/img/setup-ie/FinalWebClient/7B_Finish.mp4',
		stepLabel: I18n.get('_VirtualMachine_'),
		stepNum: 2,
		type: 'video',
	},
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SetupInstruction_8B_'),
		src: 'assets/img/setup-ie/FinalWebClient/8B_Wait.mp4',
		stepLabel: I18n.get('_VirtualMachine_'),
		stepNum: 2,
		type: 'video',
	},
];

/**
 * Slides for Insight Engine setup after OVA deploy
 */
const ieSlides: Slide[] = [
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SetupInstruction_9A_'),
		src: 'assets/img/setup-ie/FinalThickClient/Confirmation_ScreenGrab_cropped.jpg',
		stepLabel: I18n.get('_CiscoCXCollector_'),
		stepNum: 3,
		type: 'image',
	},
	{
		buttonText: I18n.get('_ConfigurationIsComplete_'),
		content: I18n.get('_SetupInstruction_10A_'),
		src: 'assets/img/setup-ie/FinalThickClient/Configuration_ScreenGrab_cropped.jpg',
		stepLabel: I18n.get('_CiscoCXCollector_'),
		stepNum: 3,
		type: 'image',
	},
];

/**
 * First IE Slide changes based on what the ovaSelection is. This function computes that.
 * @param ovaSelection OvaSelection
 * @returns slides
 */
function getIESlides (ovaSelection: Selection) {
	const slides = _.cloneDeep(ieSlides);
	switch (ovaSelection) {
		case Selection.VSPHERE:
			slides.unshift({
				buttonText: I18n.get('_IveDoneThis_'),
				content: I18n.get('_SetupInstruction_8A_'),
				src: 'assets/img/setup-ie/FinalThickClient/8a_Open.mp4',
				stepLabel: I18n.get('_CiscoCXCollector_'),
				stepNum: 3,
				type: 'video',
			});
			break;
		case Selection.VCENTER:
			slides.unshift({
				buttonText: I18n.get('_IveDoneThis_'),
				content: I18n.get('_SetupInstruction_9B_'),
				src: 'assets/img/setup-ie/FinalWebClient/9B_OpenConsole_v02.mp4',
				stepLabel: I18n.get('_CiscoCXCollector_'),
				stepNum: 3,
				type: 'video',
			});
			break;
		case Selection.VBOX:
			slides.unshift({
				buttonText: I18n.get('_IveDoneThis_'),
				content: I18n.get('_SetupInstruction_4C_'),
				src: 'assets/img/setup-ie/FinalVirtualBox/4C_Open.mp4',
				stepLabel: I18n.get('_CiscoCXCollector_'),
				stepNum: 3,
				type: 'video',
			});
			break;
		default:
	}

	return slides;
}

/**
 * Slides for syslog
 */
const syslogSlides: Slide[] = [
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SyslogSlide1Text_'),
		src: 'assets/img/setup-ie/syslog_1.png',
		stepLabel: I18n.get('_CiscoDNACollector_'),
		stepNum: 6,
		type: 'image',
	},
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SyslogSlide2Text_'),
		src: 'assets/img/setup-ie/syslog_2.png',
		stepLabel: I18n.get('_CiscoDNACollector_'),
		stepNum: 6,
		type: 'image',
	},
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SyslogSlide3Text_'),
		src: 'assets/img/setup-ie/syslog_3.png',
		stepLabel: I18n.get('_CiscoDNACollector_'),
		stepNum: 6,
		type: 'image',
	},
	{
		buttonText: I18n.get('_IveDoneThis_'),
		content: I18n.get('_SyslogSlide4Text_'),
		src: 'assets/img/setup-ie/syslog_4.png',
		stepLabel: I18n.get('_CiscoDNACollector_'),
		stepNum: 6,
		type: 'image',
	},
];

/**
 * Returns an array of slides given a slideset name
 * @param slideset - name of the slide set
 * @param ovaSelection - ovaSelection query param
 * @returns slides
 */
export function getSlides (slideset: SlideSet, ovaSelection?: Selection): Slide[] {
	switch (slideset) {
		case 'ie':
			return getIESlides(ovaSelection);
		case 'vcenter':
			return vCenterSlides;
		case 'vbox':
			return vboxSlides;
		case 'ova':
			return ovaSlides;
		case 'syslog':
			return syslogSlides;
	}
}
