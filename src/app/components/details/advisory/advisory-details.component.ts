import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	OnDestroy,
} from '@angular/core';
import * as _ from 'lodash-es';
import { I18n } from '@cisco-ngx/cui-utils';
import { Data as SecurityData } from './security/security-details.component';
import { Data as FieldNoticeData } from './field-notice/field-notice-details.component';
import { Data as BugData } from './bug/bug-details.component';
import {
	Asset,
	CriticalBug,
	FieldNoticeAdvisory,
	NetworkElement,
	SecurityAdvisoryInfo,
} from '@sdp-api';
import { UserResolve } from '@utilities';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AdvisoryType, Alert, Panel360 } from '@interfaces';
import { DetailsPanelStackService } from '@services';
import { Impacted } from './impacted-assets/impacted-assets.component';

/**
 * Advisory Details Component
 */
@Component({
	host: {
		'[class.hidden]': 'hidden',
	},
	selector: 'advisory-details',
	templateUrl: './advisory-details.component.html',
})
export class AdvisoryDetailsComponent implements OnChanges, OnInit, OnDestroy, Panel360 {

	@Input('advisory') public advisory: CriticalBug | FieldNoticeAdvisory | SecurityAdvisoryInfo;
	@Input('advisoryId') public advisoryId: string;
	@Input('selectedAsset') public selectedAsset?: Asset;
	@Input('type') public type: AdvisoryType;
	@Output('close') public close = new EventEmitter<boolean>();

	public alert: any = { };
	public loading = true;
	public title: string;
	public customerId: string;
	public details: BugData | FieldNoticeData | SecurityData;
	private destroyed$: Subject<void> = new Subject<void>();

	public hidden = true;
	public fullscreen = false;
	public impactedAssets: (Asset | NetworkElement)[];

	constructor (
		private userResolve: UserResolve,
		private detailsPanelStackService: DetailsPanelStackService,
	) {
		this.userResolve.getCustomerId()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((id: string) => {
			this.customerId = id;
		});
	}

	/**
	 * Clears the variables
	 */
	private clear () {
		this.title = null;
		this.type = null;
		this.advisoryId = null;
		this.advisory = null;
		this.loading = false;
	}

	/**
	 * determine if close from child data
	 * @param $event gets the boolean value
	 */
	public onPanelClose () {
		this.clear();
		this.close.emit(true);
	}

	/**
	 * Will handle passing data to our header component
	 * @param data the loaded data
	 */
	public onDetailsLoad (data: BugData | FieldNoticeData | SecurityData) {
		this.details = data;
		this.loading = false;
	}

	/**
	 * Refreshes the component
	 */
	public refresh () {
		this.loading = true;
		this.details = { };
		if ((this.advisoryId || this.advisory) && this.type) {
			if (!this.advisoryId) {
				this.advisoryId = _.toString(_.get(this.advisory, 'id'));
			}

			if (this.type === 'field') {
				this.title = `${I18n.get('_FieldNotice_')} FN ${this.advisoryId}`;
			} else if (this.type === 'security') {
				this.title = I18n.get('_SecurityAdvisory_');
			} else if (this.type === 'bug') {
				this.title = `${I18n.get('_Bug_')} ${this.advisoryId}`;
			} else {
				this.clear();
			}
		}
	}

	/**
	 * Checks if our currently selected asset has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentAdvisoryId = _.get(changes, ['advisoryId', 'currentValue']);
		const currentAdvisory = _.get(changes, ['advisory', 'currentValue']);
		if ((currentAdvisoryId && !changes.advisoryId.firstChange)
			|| (currentAdvisory && !changes.advisory.firstChange)) {
			_.invoke(this.alert, 'hide');
			this.refresh();
		}
	}

	/**
	 * Handles displaying an alert from its child components
	 * @param alert the alert to display
	 */
	public handleAlert (alert: Alert) {
		this.alert.show(alert.message, alert.severity);
	}

	/**
	 * Handles the hidden event from details-panel
	 * @param hidden false if details slideout is open
	 */
	public handleHidden (hidden: boolean) {
		this.hidden = hidden;
		if (hidden) {
			this.onAllPanelsClose();
		}
	}

	/**
	 * Initializer
	 */
	public ngOnInit () {
		this.detailsPanelStackService.push(this);
		this.hidden = false;
		this.refresh();
	}

	/**
	 * Destroys the component
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * Removes the 360 panel from the stack when the back button is pressed
	 */
	public onPanelBack () {
		this.detailsPanelStackService.pop();
	}

	/**
	 * Closes all 360 panels
	 */
	public onAllPanelsClose () {
		this.detailsPanelStackService.reset();
	}

	/**
	 * Will filter out our impacted assets by those that are covered
	 * @param event the assets
	 */
	public assetHandler (event: Impacted) {
		this.impactedAssets = _.filter(event.assets, 'supportCovered');
	}
}
