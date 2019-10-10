import { SETUP_STATES } from '@classes';

// import { ConnectCollectorComponent } from '../connect-collector/connect-collector.component';
// import {
// 	RegisterCollectorComponent,
// } from '../register-collector/register-collector.component';
// import { ConnectDNACenterComponent } from '../connect-dna-center/connect-dna-center.component';
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
				// {
				// 	state: SETUP_STATES.CONNECT_COLLECTOR,
				// 	type: ConnectCollectorComponent,
				// },
				// {
				// 	state: SETUP_STATES.CONFIGURE_COLLECTOR,
				// 	type: RegisterCollectorComponent,
				// },
				// {
				// 	state: SETUP_STATES.CONNECT_DNAC,
				// 	type: ConnectDNACenterComponent,
				// },
				// {
				// 	inputs: {
				// 		slideSet: 'syslog',
				// 	},
				// 	state: SETUP_STATES.CONNECT_DNAC,
				// 	type: DeployStepsComponent,
				// },
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
				// {
				// 	state: SETUP_STATES.CONNECT_COLLECTOR,
				// 	type: ConnectCollectorComponent,
				// },
				// {
				// 	state: SETUP_STATES.CONFIGURE_COLLECTOR,
				// 	type: RegisterCollectorComponent,
				// },
				// {
				// 	state: SETUP_STATES.CONNECT_DNAC,
				// 	type: ConnectDNACenterComponent,
				// },
				// {
				// 	inputs: {
				// 		slideSet: 'syslog',
				// 	},
				// 	state: SETUP_STATES.CONNECT_DNAC,
				// 	type: DeployStepsComponent,
				// },
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
				// {
				// 	state: SETUP_STATES.CONNECT_COLLECTOR,
				// 	type: ConnectCollectorComponent,
				// },
				// {
				// 	state: SETUP_STATES.CONFIGURE_COLLECTOR,
				// 	type: RegisterCollectorComponent,
				// },
				// {
				// 	state: SETUP_STATES.CONNECT_DNAC,
				// 	type: ConnectDNACenterComponent,
				// },
				// {
				// 	inputs: {
				// 		slideSet: 'syslog',
				// 	},
				// 	state: SETUP_STATES.CONNECT_DNAC,
				// 	type: DeployStepsComponent,
				// },
			];
		default:
	}
}
