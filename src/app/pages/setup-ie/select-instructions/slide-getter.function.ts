import { SETUP_STATES } from '@classes';
import { DeployStepsComponent } from '../deploy-steps/deploy-steps.component';
import { Selection } from '../setup-ie.types';

/**
 * Returns a set of instruction slides
 * @param selection - {Selection}
 * @returns slides - {Slide[]}
 */
export function getSlides (selection: Selection) {
	switch (selection) {
		case Selection.VSPHERE:
			return [
				{
					inputs: {
						slideSet: 'ova',
					},
					state: SETUP_STATES.INSTALL,
					type: DeployStepsComponent,
				},
				{
					inputs: {
						slideSet: 'ie',
					},
					state: SETUP_STATES.INSTALL,
					type: DeployStepsComponent,
				},
			];
		case Selection.VCENTER:
			return [
				{
					inputs: {
						slideSet: 'vcenter',
					},
					state: SETUP_STATES.INSTALL,
					type: DeployStepsComponent,
				},
				{
					inputs: {
						slideSet: 'ie',
					},
					state: SETUP_STATES.INSTALL,
					type: DeployStepsComponent,
				},
			];
		case Selection.VBOX:
			return [
				{
					inputs: {
						slideSet: 'vbox',
					},
					state: SETUP_STATES.INSTALL,
					type: DeployStepsComponent,
				},
				{
					inputs: {
						slideSet: 'ie',
					},
					state: SETUP_STATES.INSTALL,
					type: DeployStepsComponent,
				},
			];
		default:
	}
}
