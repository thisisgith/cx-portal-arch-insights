import { Component, EventEmitter, Inject, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LogService } from '@cisco-ngx/cui-services';
import { SetupStep } from '@interfaces';
import { UtilsService } from '@services';

import { ControlPointIERegistrationAPIService, User } from '@sdp-api';
import { EULAInstructionsHTML } from './eula-instructions.const';

import { empty, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';

/**
 * Component to prompt user to download OVA image
 */
@Component({
	selector: 'app-download-image',
	styleUrls: ['./download-image.component.scss'],
	templateUrl: './download-image.component.html',
})
export class DownloadImageComponent implements OnDestroy, SetupStep {
	@Output('onStepComplete') public onStepComplete = new EventEmitter<void>();
	private destroyed$: Subject<void> = new Subject<void>();
	private user: User;
	private customerId: string;

	public acceptedEULA = false;
	public acceptedSE = false;
	public businessFn: 'civ' | 'gov';
	public inCountry: 'yes' | 'no';
	public showInstructions = false;
	public clickedDownload = false;
	public error = false;
	public loading = false;
	public EULAInstructionsHTML = EULAInstructionsHTML;

	/**
	 * Whether or not the CONTINUE button should be disabled
	 */
	public get isDisabled () {
		return  !this.acceptedEULA
			|| !this.acceptedSE
			|| !this.businessFn
			|| (this.businessFn === 'gov' && !this.inCountry);
	}

	constructor (
		@Inject('ENVIRONMENT') private env,
		private controlPointsService: ControlPointIERegistrationAPIService,
		private logger: LogService,
		private route: ActivatedRoute,
		private utils: UtilsService,
	) {
		this.logger.debug('DownloadImageComponent Created!');
		this.user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(this.user, ['info', 'customerId']);
	}

	/**
	 * NgOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * Trigger image download on button click
	 */
	public onDownload () {
		this.clickedDownload = true;
		if (this.env.ieSetup.downloadOvaLink) {
			this.utils.download(this.env.ieSetup.downloadOvaLink);
			this.controlPointsService
				.createIERegistrationUsingPOST({
					customerId: this.customerId,
				})
				.pipe(
					finalize(() => this.loading = false),
					catchError(() => {
						this.error = true;

						return empty();
					}),
					takeUntil(this.destroyed$),
				)
				.subscribe(() => {
					this.logger.debug('IE OVA download registered');
				});
		}
	}

	/**
	 * Continues to the next step
	 */
	public continue () {
		this.onStepComplete.emit();
	}
}
