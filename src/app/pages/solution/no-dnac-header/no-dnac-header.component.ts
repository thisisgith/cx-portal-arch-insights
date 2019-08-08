import { Component, HostBinding, Inject } from '@angular/core';
import { UtilsService } from '@services';

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
	public noDNAC = this.utils.getLocalStorage(this.env.ieSetup.DNAC_LS_KEY);
	@HostBinding('class.invisible') get isInvisible () {
		return !this.noDNAC;
	}
	constructor (
		@Inject('ENVIRONMENT') private env,
		private utils: UtilsService,
	) { }
}
