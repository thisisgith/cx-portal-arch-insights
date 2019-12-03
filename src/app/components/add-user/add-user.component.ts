import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LogService } from '@cisco-ngx/cui-services';
import { catchError, takeUntil } from 'rxjs/operators';
import { empty, Subject } from 'rxjs';
import { CuiModalService } from '@cisco-ngx/cui-components';
import * as _ from 'lodash-es';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	ControlPointUserManagementAPIService,
	RoleDetails,
	UserAddRequestModel,
	UserAddResponseModel,
} from '@sdp-api';
import { UserResolve } from '@utilities';

/**
 * Add User Component
 */
@Component({
	selector: 'app-add-user',
	styleUrls: ['./add-user.component.scss'],
	templateUrl: './add-user.component.html',
})
export class AddUserComponent implements OnInit, OnDestroy {
	public addUserForm = new FormGroup({
		ccoid: new FormControl('', [Validators.required]),
		email: new FormControl('', [Validators.required]),
		title: new FormControl('', [Validators.required]),
		verifyCheckbox: new FormControl('', [Validators.required]),
	});
	public alert: any = { };
	public response: any;
	public items: RoleDetails[];
	private destroyed$: Subject<void> = new Subject<void>();
	public userDetails: UserAddRequestModel;
	public isParntner = 'false';
	public addUserResponse: UserAddResponseModel;
	public isLoading = false;
	public customerId: string;
	public saAccountId: string;

	constructor (
		public cuiModalService: CuiModalService,
		private userService: ControlPointUserManagementAPIService,
		private logger: LogService,
		private userReslove: UserResolve,
	) {
		this.userReslove.getSaId()
		.pipe(takeUntil(this.destroyed$))
		.subscribe(saId => this.saAccountId = saId.toString());
		this.userReslove.getCustomerId()
		.pipe(takeUntil(this.destroyed$))
		.subscribe(customerId => this.customerId = customerId);
	}

	/**
	 *  NgOnInit
	 */
	public ngOnInit () {
		this.alert.visible = false;
		this.isLoading = false;
		document.getElementById('input-ccoid')
			.focus();
		this.userService
			.getListRolesForGivenUserUsingGET(this.saAccountId)
			.pipe(takeUntil(this.destroyed$))
			.subscribe(data => {
				this.response = data;
				this.items = this.response.saRoles;
			});
	}

	/**
	 *  NgOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * Add User Component
	 */
	public onContinue () {
		this.isLoading = true;
		this.userDetails = {
			ccoId: this.addUserForm.value.ccoid,
			customerId: this.customerId,
			email: this.addUserForm.value.email,
			isPartner: this.isParntner,
			rolesAdded: [
				{
					role: this.addUserForm.value.title,
				},
			],
			saAccountId: this.saAccountId,
		};

		this.userService
			.AddNewUserUsingPOST(this.userDetails)
			.pipe(
				catchError(err => {
					this.logger.error(
						'add-user.component : onContinue() ' +
						`:: Error : (${err.status}) ${err.message}`,
					);

					return empty();
				}),
				takeUntil(this.destroyed$),
			)
			.subscribe(response => {
				this.isLoading = false;
				this.addUserResponse = response;
				if (response.status === 200) {
					this.cuiModalService.onSuccess.emit(true);
					this.cuiModalService.hide();
				} else if (response.status === 500) {
					if (response.data && response.data[0].status === 500) {
						_.invoke(
							this.alert,
							'show',
							I18n.get('_UserAlreadyadded_'),
							'danger',
						);
						this.alert.visible = true;
					} else {
						_.invoke(
							this.alert,
							'show',
							I18n.get('_CCOIDAndEmailDoNotMatch_'),
							'danger',
						);
						this.alert.visible = true;
					}
				}
			});
	}
}
