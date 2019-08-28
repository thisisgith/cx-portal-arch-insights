import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { LogService } from '@cisco-ngx/cui-services';
import { SetupStep } from '@interfaces';
import { ASDAPIService, UtilsService } from '@services';
import { I18n } from '@cisco-ngx/cui-utils';

import { ControlPointIERegistrationAPIService, User } from '@sdp-api';

import { empty, of, Subject, throwError } from 'rxjs';
import { catchError, finalize, map, mergeMap, retryWhen, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';

import { K9FormData } from './k9-form/k9-form.component';
import { EulaFormData } from './eula-form/eula-form.component';

/**
 * Component to prompt user to download OVA image
 */
@Component({
	selector: 'app-download-image',
	styleUrls: ['./download-image.component.scss'],
	templateUrl: './download-image.component.html',
})
export class DownloadImageComponent implements OnDestroy, OnInit, SetupStep {
	@Output('onStepComplete') public onStepComplete = new EventEmitter<void>();
	private destroyed$: Subject<void> = new Subject<void>();
	private user: User;
	private customerId: string;
	private downloadSessionId: string;
	private metadataTransId: string;
	private imageGuid: string;

	public acceptedEULA = false;
	public acceptedSE = false;
	public businessFn: 'civ' | 'gov';
	public inCountry: 'yes' | 'no';
	public showInstructions = false;
	public error: string;
	public loading = false;
	public view: 'pre-download' | 'k9' | 'k9-decline' | 'eula';
	public didDecline = false;

	public k9Data: Partial<K9FormData> = { };
	public eulaData: Partial<EulaFormData> = { };
	public k9Form = new FormGroup({
		ccoid: new FormControl(),
		email: new FormControl(),
		firstName: new FormControl(),
		lastName: new FormControl(),
	});

	/**
	 * Whether or not the CONTINUE button should be disabled
	 */
	public get isDisabled () {
		return  !this.acceptedSE
			|| !this.businessFn
			|| (this.businessFn === 'gov' && !this.inCountry);
	}

	constructor (
		@Inject('ENVIRONMENT') private env,
		private asdService: ASDAPIService,
		private controlPointsService: ControlPointIERegistrationAPIService,
		private logger: LogService,
		private route: ActivatedRoute,
		private router: Router,
		private utils: UtilsService,
	) {
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
	 * NgOnInit
	 */
	public ngOnInit () {
		this.loading = true;
		this.refreshMetadata()
			.pipe(
				finalize(() => this.loading = false),
				mergeMap(() => this.getDownloadURL()),
				catchError(() => {
					this.showError(I18n.get('_AnErrorOccurredDuringDownload_'));

					return empty();
				}),
			)
			.subscribe(() => {
				if (_.isEmpty(this.eulaData)) {
					this.view = 'pre-download';
				} else {
					this.view = 'eula';
				}
				if (!_.isEmpty(this.k9Data)) {
					this.view = 'k9';
				}
			});
	}

	/**
	 * Accept EULA and then download
	 */
	public acceptEULAAndDownload () {
		this.loading = true;
		this.asdService.acceptEULA(this.downloadSessionId)
			.pipe(
				catchError(() => {
					this.showError(I18n.get('_AnErrorOccurredDuringDownload_'));

					return empty();
				}),
				takeUntil(this.destroyed$),
			)
			.subscribe(() => {
				this.onDownload();
			});
	}

	/**
	 * Trigger image download on button click
	 */
	public onDownload () {
		this.loading = true;
		this.getDownloadURL()
			.pipe(
				finalize(() => this.loading = false),
				mergeMap(response => {
					const hasError = _.get(response, 'download_info_list[0]' +
						'.asd_download_url_exception.length');
					if (!hasError) {
						const url = _.get(response, 'download_info_list[0].cloud_url')
							|| _.get(response, 'download_info_list[0].download_url');
						if (url) {
							this.utils
								.download(`${url}?access_token=${this.asdService.accessToken}`);
						}

						return of(response);
					}

					return throwError('metadata trans id expired');
				}),
				retryWhen(errors => errors
					.pipe(
						mergeMap((err: string, i: number) => {
							if (i < 1) {
								// try once to refresh the metadata_trans_id
								return this.refreshMetadata();
							}

							return throwError(err);
						}),
					),
				),
				catchError(() => {
					this.showError(I18n.get('_AnErrorOccurredDuringDownload_'));

					return empty();
				}),
				takeUntil(this.destroyed$),
			)
			.subscribe(() => {
				this.continue();
			});

		this.controlPointsService
			.createIERegistrationUsingPOST({
				customerId: this.customerId,
			})
			.pipe(
				finalize(() => this.loading = false),
				catchError(() => {
					this.showError(I18n.get('_AnErrorOccurredDuringDownload_'));

					return empty();
				}),
				takeUntil(this.destroyed$),
			)
			.subscribe(() => {
				this.logger.debug('IE OVA download registered');
			});
	}

	/**
	 * Continues to the next step
	 */
	public continue () {
		this.onStepComplete.emit();
	}

	/**
	 * Handler for K9 Acceptance
	 * @param acceptObj - AcceptEmission
	 */
	public onAcceptK9 (acceptObj) {
		this.loading = true;
		const bizFnInput = acceptObj.bizFnInput === 'civ' ? 'COMM_OR_CIVIL' : 'GOV_OR_MIL';
		this.asdService.acceptK9(bizFnInput, this.downloadSessionId, acceptObj.inCountryInput)
			.pipe(
				finalize(() => this.loading = false),
				catchError(() => {
					this.showError(I18n.get('_AnErrorOccurredDuringDownload_'));

					return empty();
				}),
				takeUntil(this.destroyed$),
			)
			.subscribe(() => {
				if (!_.isEmpty(this.eulaData)) {
					this.view = 'eula';
				} else {
					this.view = 'pre-download';
				}
			});
	}

	/**
	 * Handler for Declination
	 */
	public onDecline () {
		// this.view = 'k9-decline';
		this.showError(I18n.get('_AgreementIsRequiredToProceed_'));
		this.didDecline = true;
	}

	/**
	 * Handler for cancelling K9 Declination
	 */
	public cancelK9Decline () {
		this.view = 'k9';
	}

	/**
	 * Handler for confirming K9 Declination
	 */
	public confirmK9Decline () {
		this.router.navigate(['/']);
	}

	/**
	 * Refreshes the download metadata info
	 * @returns Observable
	 */
	private refreshMetadata () {
		return this.asdService.getMetadata()
			.pipe(
				map(response => {
					this.metadataTransId = _.get(response, 'metadata_response.metadata_trans_id');
					this.imageGuid = _.get(response, 'metadata_response.metadata_mdfid_list[0]' +
						'.software_response_list[0].platform_list[0]' +
						'.release_list[0].image_details[0].image_guid');

					return response;
				}),
			);
	}

	/**
	 * Shows the error banner and scrolls to the top of the page
	 * @param errorText - string
	 */
	private showError (errorText: string) {
		// scroll to top
		const scrollbarElem = document.getElementsByClassName('slide-container');
		if (scrollbarElem && scrollbarElem[0]) {
			scrollbarElem[0].scrollTop = 0;
		}

		this.error = errorText;
	}

	/**
	 * Gets the download URL and sets local variables
	 * @returns Observable
	 */
	private getDownloadURL () {
		return this.asdService
			.getDownloadURL(this.metadataTransId, this.imageGuid)
			.pipe(map(response => {
				this.downloadSessionId = _.get(response, 'download_session_id');
				const eulaException = _.find(
					_.get(response, 'asd_download_acceptance_exception'),
					elem => _.get(elem, 'acceptance_form.eula_form_details'),
				);
				const k9Exception = _.find(
					_.get(response, 'asd_download_acceptance_exception'),
					elem => _.get(elem, 'acceptance_form.k9_form_details_response'),
				);
				const k9Data = _.get(k9Exception,
					'acceptance_form.k9_form_details_response.form_details_type.field_details');
				const eulaData = _.get(eulaException,
					'acceptance_form.eula_form_details.form_details_type.field_details');
				if (eulaData) {
					this.eulaData.checkboxDescription = _.get(eulaData, '[0].field_value');
					this.eulaData.label = _.get(eulaData, '[2].field_value');
				} else {
					this.eulaData = { };
				}
				if (k9Data) {
					this.k9Data.k9FormText = _.get(k9Data, '[2].field_value');
					this.k9Data.firstName = _.get(k9Data, '[10].field_display_value');
					this.k9Data.lastName = _.get(k9Data, '[11].field_display_value');
					this.k9Data.email = _.get(k9Data, '[12].field_display_value');
					this.k9Data.ccoid = _.get(this, 'user.info.individual.ccoId');
					this.k9Data.acceptK9CheckboxText = _.get(k9Data, '[8].field_display_value');
					this.k9Data.commOrCivText = _.get(k9Data, '[13].child_field_details_type[0]' +
						'.field_display_name');
					this.k9Data.govOrMilText = _.get(k9Data, '[13].child_field_details_type[1]' +
						'.field_display_name');
					this.k9Data.countriesText = _.get(k9Data, '[14].field_value');
					this.k9Data.yesText = _.get(k9Data, '[14].child_field_details_type[0]' +
						'.field_value');
					this.k9Data.noText = _.get(k9Data, '[14].child_field_details_type[1]' +
						'.field_value');
				} else {
					this.k9Data = { };
				}

				return response;
			}));
	}
}
