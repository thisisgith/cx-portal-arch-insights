import {
	Component,
	HostBinding,
	Inject,
	ViewChild,
	ElementRef,
	Output,
	EventEmitter,
	HostListener,
} from '@angular/core';
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
	@Output() public buttonData: EventEmitter<{ }> = new EventEmitter<{ }>();
	private continueSetupButton: ElementRef;
	@ViewChild('continueSetupButton', { static: false }) set button (button: ElementRef) {
		if (button) {
			this.continueSetupButton = button;
			this.refreshButton();
		}
	}

	@HostBinding('class.invisible') get isInvisible () {
		return (!this.noDNAC && this.hasCXCollector) || this.forceHidden || !this.production;
	}
	constructor (
		@Inject('ENVIRONMENT') private env,
		private utils: UtilsService,
	) { }

	/**
	 * On window resize, refresh button
	 * @param event resize event
	 */
	@HostListener('window:resize')
	public onResize () {
		this.refreshButton();
	}

	/**
	 * Emit position and dimensions of "Continue" button
	 */
	public refreshButton () {
		this.buttonData.emit({
			active: !this.isInvisible,
			left: this.continueSetupButton.nativeElement.offsetLeft +
			this.continueSetupButton.nativeElement.offsetWidth / 2,
			top: this.continueSetupButton.nativeElement.offsetTop +
				this.continueSetupButton.nativeElement.offsetHeight / 2,
		});
	}
}
