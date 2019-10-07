import {
	Component, ElementRef, EventEmitter, HostBinding, HostListener, Inject, OnDestroy, OnInit,
	Output, ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventoryService, RacetrackSolution, RacetrackTechnology } from '@sdp-api';
import { UtilsService, RacetrackInfoService } from '@services';
import { empty, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';

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
export class NoDNACHeaderComponent implements OnDestroy, OnInit {
	public production = _.get(this.env, 'production', false);
	public noDNAC = this.utils.getLocalStorage(this.env.ieSetup.DNAC_LS_KEY);
	public hasCXCollector = true;
	public forceHidden = false;
	@Output() public buttonData: EventEmitter<{ }> = new EventEmitter<{ }>();
	private continueSetupButton: ElementRef;
	private customerId: string;
	private selectedSolutionName: string;
	private selectedTechnologyName: string;
	private destroyed$: Subject<void> = new Subject<void>();
	@ViewChild('continueSetupButton', { static: false }) set button (button: ElementRef) {
		if (button) {
			this.continueSetupButton = button;
			this.refreshButton();
		}
	}

	@HostBinding('class.invisible') get isInvisible () {
		return (!this.noDNAC && this.hasCXCollector) || this.forceHidden;
	}
	constructor (
		@Inject('ENVIRONMENT') private env,
		private inventoryService: InventoryService,
		private route: ActivatedRoute,
		private utils: UtilsService,
		private racetrackInfoService: RacetrackInfoService,
	) {
		if (window.Cypress) {
			this.forceHidden = _.get(window, 'Cypress.hideDNACHeader', false);
		}
	 }

	/**
	 * On window resize, refresh button
	 * @param event resize event
	 */
	@HostListener('window:resize')
	public onResize () {
		this.refreshButton();
	}

	/**
	 * NgOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * NgOnInit
	 */
	public ngOnInit () {
		this.racetrackInfoService.getCurrentSolution()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((solution: RacetrackSolution) => {
			this.selectedSolutionName = _.get(solution, 'name');
		});

		this.racetrackInfoService.getCurrentTechnology()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((technology: RacetrackTechnology) => {
			if (this.selectedTechnologyName !== _.get(technology, 'name')) {
				this.selectedTechnologyName = _.get(technology, 'name');
				this.checkNetworkElements();
			}
		});
	}

	/**
	 * Call to check the network elements
	 */
	private checkNetworkElements () {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.inventoryService.getNetworkElements({
			customerId: this.customerId,
			solution: this.selectedSolutionName,
			useCase: this.selectedTechnologyName,
		})
		.pipe(
			catchError(() => empty()),
			takeUntil(this.destroyed$),
		)
		.subscribe(res => {
			this.hasCXCollector = res.Pagination.total !== 0;
		});
	}

	/**
	 * Emit position and dimensions of "Continue" button
	 */
	public refreshButton () {
		const btn = this.continueSetupButton.nativeElement.getBoundingClientRect();
		this.buttonData.emit({
			active: !this.isInvisible,
			left: btn.left + btn.width / 2,
			top: btn.top - btn.height / 2,
		});
	}
}
