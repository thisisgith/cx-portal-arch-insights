import { SETUP_STATES } from '@classes';

import { ConnectCollectorComponent } from '../connect-collector/connect-collector.component';
import {
	RegisterCollectorComponent,
} from '../register-collector/register-collector.component';
import { ConnectDNACenterComponent } from '../connect-dna-center/connect-dna-center.component';
import { DeployStepsComponent } from '../deploy-steps/deploy-steps.component';
import { DownloadImageComponent } from '../download-image/download-image.component';
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
					state: SETUP_STATES.INIT,
					type: DownloadImageComponent,
				},
				{
					inputs: {
						slideSet: 'ova',
					},
					state: SETUP_STATES.OVA,
					type: DeployStepsComponent,
				},
				{
					inputs: {
						slideSet: 'ie',
					},
					state: SETUP_STATES.IE,
					type: DeployStepsComponent,
				},
				{
					state: SETUP_STATES.COLLECTOR,
					type: ConnectCollectorComponent,
				},
				{
					state: SETUP_STATES.COLLECTOR,
					type: RegisterCollectorComponent,
				},
				{
					state: SETUP_STATES.COLLECTOR,
					type: ConnectDNACenterComponent,
				},
				{
					inputs: {
						slideSet: 'syslog',
					},
					state: SETUP_STATES.COLLECTOR,
					type: DeployStepsComponent,
				},
			];
		case Selection.VCENTER:
			return [
				{
					state: SETUP_STATES.INIT,
					type: DownloadImageComponent,
				},
				{
					inputs: {
						slideSet: 'vcenter',
					},
					state: SETUP_STATES.OVA,
					type: DeployStepsComponent,
				},
				{
					inputs: {
						slideSet: 'ie',
					},
					state: SETUP_STATES.IE,
					type: DeployStepsComponent,
				},
				{
					state: SETUP_STATES.COLLECTOR,
					type: ConnectCollectorComponent,
				},
				{
					state: SETUP_STATES.COLLECTOR,
					type: RegisterCollectorComponent,
				},
				{
					state: SETUP_STATES.COLLECTOR,
					type: ConnectDNACenterComponent,
				},
				{
					inputs: {
						slideSet: 'syslog',
					},
					state: SETUP_STATES.COLLECTOR,
					type: DeployStepsComponent,
				},
			];
		case Selection.VBOX:
			return [
				{
					state: SETUP_STATES.INIT,
					type: DownloadImageComponent,
				},
				{
					inputs: {
						slideSet: 'vbox',
					},
					state: SETUP_STATES.OVA,
					type: DeployStepsComponent,
				},
				{
					inputs: {
						slideSet: 'ie',
					},
					state: SETUP_STATES.IE,
					type: DeployStepsComponent,
				},
				{
					state: SETUP_STATES.COLLECTOR,
					type: ConnectCollectorComponent,
				},
				{
					state: SETUP_STATES.COLLECTOR,
					type: RegisterCollectorComponent,
				},
				{
					state: SETUP_STATES.COLLECTOR,
					type: ConnectDNACenterComponent,
				},
				{
					inputs: {
						slideSet: 'syslog',
					},
					state: SETUP_STATES.COLLECTOR,
					type: DeployStepsComponent,
				},
			];
		default:
	}
}
