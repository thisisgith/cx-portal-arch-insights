import { Component, HostBinding, Inject } from '@angular/core';
import { UtilsService } from '@services';
import * as _ from 'lodash-es';
import { environment } from '@environment';

/**
 * Panel for displaying sub-header content
 */
@Component({
	host: {
		class: 'panel panel--raised',
	},
	selector: 'no-dnac-header',
	styleUrls: ['./no-dnac-header.component.scss'],
	templateUrl: './no-dnac-header.component.html',
})
export class NoDNACHeaderComponent {
	public production = _.get(environment, 'production', false);
	public noDNAC = this.utils.getLocalStorage(this.env.ieSetup.DNAC_LS_KEY);
	public hasCXCollector = this.utils.getLocalStorage(this.env.ieSetup.CX_Coll_Reg_LS_KEY);
	public forceHidden = false;
	@HostBinding('class.invisible') get isInvisible () {
		return (!this.noDNAC && this.hasCXCollector) || this.forceHidden;
	}
	constructor (
		@Inject('ENVIRONMENT') private env,
		private utils: UtilsService,
	) { }
}
