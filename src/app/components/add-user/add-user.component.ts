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
	VADetails,
} from '@sdp-api';
import { UserResolve } from '@utilities';
import { vaAccount } from '@constants';

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
		email: new FormControl('', [Validators.required, Validators.email]),
		virtualAccount: new FormControl('', []),
		verifyCheckbox: new FormControl('', [Validators.required]),
	});
	public alert: any = { };
	public response: any;
	public items: RoleDetails[];
	public itemsVa: VADetails[];
	private destroyed$: Subject<void> = new Subject<void>();
	public userDetails: UserAddRequestModel;
	public isVAUser = false;
	public isParntner = 'false';
	public addUserResponse: UserAddResponseModel;
	public isLoading = false;
	public customerId: string;
	public saAccountId: string;
	public role: string;
	public roleObject: any = { };
	public active: boolean;

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
		this.userService
			.getVAListForGivenSACUsingGET(this.saAccountId)
			.pipe(takeUntil(this.destroyed$))
			.subscribe(data => {
				const response: any = data;
				this.itemsVa = response.data;
			});
		this.onFormChanges();
	}

	/**
	 *  NgOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 *  Called on changes in form
	 */
	public onFormChanges () {
		this.addUserForm
			.get('virtualAccount')
			.valueChanges
			.pipe(takeUntil(this.destroyed$))
			.subscribe(val => {
				this.items = [];
				this.active = false;
				if (val) {
					this.isVAUser = true;
					this.items = this.response.saVaRoles;
				} else {
					this.isVAUser = false;
					this.items = this.response.saRoles;
				}
			});
	}

	/**
	 * on Continue Function
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
					role: this.roleObject.role,
				},
			],
			saAccountId: this.saAccountId,
		};
		if (this.isVAUser) {
			this.userDetails.rolesAdded[0].type_1 = vaAccount;
			this.userDetails.rolesAdded[0].value_1 = this.addUserForm.value.virtualAccount;
		}

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
						if (/CSC_ABAC_021/.test(response.data[0].errCode)) {
							_.invoke(
								this.alert,
								'show',
								I18n.get('_UserAlreadyadded_'),
								'danger',
							);
						} else {
							_.invoke(
								this.alert,
								'show',
								response.data[0].errMsg,
								'danger',
							);
						}
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

	/**
	 * Method to handle toggle of Role dropdown
	 */
	public roleToggle () {
		this.active = !this.active;
	}

	/**
	 * Method to handle Role selection
	 * @param val role value
	 * @param index role index
	 */
	public selectRole (val, index) {
		this.items.forEach((data: any, i) => {
			if (i === index) {
				data.selected = true;
			} else {
				data.selected = false;
			}
		});
		this.role = val.roleDisplayName;
		this.roleObject = val;
		this.active = false;
	}

	/**
	 * Method to clear Role dropdown for VA
	 */
	public onVirtualAccountSelected () {
		this.role = null;
		this.items.forEach((val: any) => {
			val.selected = false;
		});

	}
}
