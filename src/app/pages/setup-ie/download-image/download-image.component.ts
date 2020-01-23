import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectInstructionsComponent } from '../select-instructions/select-instructions.component';

import { LogService } from '@cisco-ngx/cui-services';
import { OnStepCompleteInsertOptions, SetupStep } from '@interfaces';
import { SETUP_STATES } from '@classes';
import { SetupIEStateService } from '../setup-ie-state.service';
import { ASDAPIService, UtilsService } from '@services';
import { I18n } from '@cisco-ngx/cui-utils';

import { ControlPointIERegistrationAPIService, User } from '@sdp-api';

import { empty, of, Subject, throwError, timer } from 'rxjs';
import { catchError, finalize, mergeMap, retryWhen, takeUntil, tap } from 'rxjs/operators';
import * as _ from 'lodash-es';

import { K9FormData } from './k9-form/k9-form.component';
import { EulaFormData } from './eula-form/eula-form.component';
import { UserResolve } from '@utilities';

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
	@Output('onStepCompleteInsert') public onStepCompleteInsert =
		new EventEmitter<OnStepCompleteInsertOptions>();
	private destroyed$: Subject<void> = new Subject<void>();
	private user: User;
	private customerId: string;
	private saId: string;
	public downloadSessionId: string;
	private metadataTransId: string;
	private imageGuid: string;

	public acceptedEULA = false;
	public acceptedSE = false;
	public businessFn: 'civ' | 'gov';
	public inCountry: 'yes' | 'no';
	public showInstructions = false;
	public error: string;
	public loading = false;
	public view: 'connect' | 'pre-download' | 'k9' | 'k9-decline' | 'eula';
	public didDecline = false;
	public region: 'emea' | 'usa' = 'usa';

	public k9Data: Partial<K9FormData> = { };
	public eulaData: Partial<EulaFormData> = { };
	public k9Form = new FormGroup({
		ccoid: new FormControl(),
		email: new FormControl(),
		firstName: new FormControl(),
		lastName: new FormControl(),
	});
	public downloadImageType: string;

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
		private state: SetupIEStateService,
		private utils: UtilsService,
		private userResolve: UserResolve,
	) {
		this.user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(this.user, ['info', 'customerId']);
		this.saId = _.get(this.user, ['info', 'saId']);
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
		this.resetViews();
		this.route.queryParams
			.pipe(
				takeUntil(this.destroyed$),
			)
			.subscribe(params => {
				if (params.downloadView === 'connect') {
					this.view = 'connect';
				} else {
					this.resetViews();
					const state = this.state.getState();
					state.downloadView = undefined;
					this.state.setState(state);
				}
			});
		this.userResolve.setUserSteps(false);
	}

	/**
	 * Resets the Views
	 */
	public resetViews () {
		const state = this.state.getState();
		if (state.compKey > 1) {
			this.view = 'connect';
		} else {
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
				this.view = 'pre-download';
				this.loading = false;
			});
	}

	/**
	 * Trigger image download on button click
	 */
	public onDownload () {
		this.loading = true;
		this.userResolve.setUserSelectedDataCenter(this.region);
		this.createRegistration()
			.pipe(
				mergeMap(() => this.commenceDownload()),
			)
			.subscribe(() => {
				this.loading = false;
				this.view = 'connect';
				this.downloadImageType = null;
			});
	}

	/**
	 * Continues to the next step
	 */
	public continue () {
		this.onStepComplete.emit();
	}

	/**
	 * Continues to the setup instructions
	 */
	public goToInstructions () {
		this.onStepCompleteInsert.emit({
			offset: 1,
			steps: [
				{
					state: SETUP_STATES.INSTALL,
					type: SelectInstructionsComponent,
				},
				{
					state: SETUP_STATES.INSTALL,
					type: DownloadImageComponent,
				},
			],
		});
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
				tap(response => {
					this.metadataTransId = _.get(response, 'metadata_response.metadata_trans_id');
					const images = _.get(response, 'metadata_response.metadata_mdfid_list[0]' +
						'.software_response_list[0].platform_list[0]' +
						'.release_list[0].image_details');
					// const nonDeletedImages = _.filter(images, { is_deleted: 'N' });
					const nonDeletedImages = _.filter(images, image =>  image.is_deleted === 'N' && image.image_guid !== 'null');
					this.imageGuid = _.map(nonDeletedImages, ele =>  ele.image_guid)
					.toString();
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
	public getDownloadURL () {
		return this.asdService
			.getDownloadURL(this.metadataTransId, this.imageGuid)
			.pipe(
				tap(response => {
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
						this.k9Data.commOrCivText = _.get(
							k9Data,
							'[13].child_field_details_type[0].field_display_name',
						);
						this.k9Data.govOrMilText = _.get(
							k9Data,
							'[13].child_field_details_type[1].field_display_name',
						);
						this.k9Data.countriesText = _.get(k9Data, '[14].field_value');
						this.k9Data.yesText = _.get(k9Data, '[14].child_field_details_type[0]' +
							'.field_value');
						this.k9Data.noText = _.get(k9Data, '[14].child_field_details_type[1]' +
							'.field_value');
					} else {
						this.k9Data = { };
					}
				}),
			);
	}

	/**
	 * Creates Registration File
	 * @returns Observable
	 */
	private createRegistration () {
		return this.controlPointsService
			.createIERegistrationUsingPOST({
				customerId: this.customerId,
				datacenter: this.region,
				saId: Number(this.saId),
				vaId: 0,
			})
			.pipe(
				catchError(() => {
					this.showError(I18n.get('_AnErrorOccurredDuringDownload_'));

					return empty();
				}),
				// purposely not using takeUntil so that request is not cancelled
			);
	}

	/**
	 * Commence Download
	 * @returns Observable
	 */
	public commenceDownload () {
		return this.getDownloadURL()
			.pipe(
				finalize(() => this.loading = false),
				mergeMap(response => {
					const hasError = _.get(
						response,
						'download_info_list[0].asd_download_url_exception.length',
					);
					const download_info_list = _.get(response, 'download_info_list');
					const selectedDownloadTypeURL = _.find(download_info_list, downloadURL => {
						 if (this.downloadImageType === 'ova' && (/^.*\.(ova)$/.test(downloadURL.image_full_name))) {
							 return downloadURL;
						 }
						 if (this.downloadImageType === 'vhd' && (/^.*\.(zip)$/.test(downloadURL.image_full_name))) {
							return downloadURL;
						 }
					});
					if (!hasError) {
						const url = decodeURIComponent(
							// disabling cloud_url temporarily because of prod auth issue
							// _.get(response, 'download_info_list[0].cloud_url') ||
							_.get(selectedDownloadTypeURL, 'download_url'),
						);
						if (url) {
							if (/[?]/.test(url)) {
								this.utils
									.download(`${url}&access_token=${this.asdService.accessToken}`);
							} else {
								this.utils
									.download(`${url}?access_token=${this.asdService.accessToken}`);
							}
						}

						return of(response);
					}

					return throwError('metadata trans id expired');
				}),
				retryWhen(errors => errors
					.pipe(
						mergeMap((err: string, i: number) => {
							if (i < _.get(this, 'env.ieSetup.imageDownloadRetries', 6)) {
								// try once to refresh the metadata_trans_id
								if (i === 0) {
									return this.refreshMetadata();
								}

								// keep trying up to 5 times
								return timer(i * 500);
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
			);
	}

	/**
	 * @param imageType Selected image type to download
	 */
	public selectImageType (imageType: string) {
		this.downloadImageType = imageType;
	}
}
