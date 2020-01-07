import { Component, OnInit } from '@angular/core';
import { get } from 'lodash-es';

import { environment } from '@environment';
import { I18n } from '@cisco-ngx/cui-utils';
import { Company } from '@sdp-api';
import { ACTIVE_SMART_ACCOUNT_KEY } from '@constants';

/**
 * Modal for selecting Smart Account
 */
@Component({
	selector: 'smart-account-selection',
	templateUrl: './smart-account-selection.component.html',
})
export class SmartAccountSelectionComponent implements OnInit {
	public data: {
		smartAccounts: Company[],
		selectedSmartAccount?: Company,
		isError?: boolean,
	} = {
		smartAccounts: [],
	};
	public errorMsg: string;
	public showSmartAccounts = false;
	public showLogOutBtn = true;
	public logOutUrl = environment.logoutUrl;

	public ngOnInit () {
		if (this.data.isError) {
			const selectedSmartAccount = get(this.data, 'selectedSmartAccount.companyName', '');
			const smartAccountsLen = this.data.smartAccounts.length;
			if (smartAccountsLen > 1) {
				this.errorMsg = I18n.get('_SmartAccountSelectionErrorMultiple_', selectedSmartAccount);
				this.showSmartAccounts = true;
				this.showLogOutBtn = false;
			} else if (smartAccountsLen === 1) {
				this.errorMsg = I18n.get('_SmartAccountSelectionErrorSingle_', selectedSmartAccount);
			} else {
				this.errorMsg = I18n.get('_SmartAccountSelectionErrorEmpty_');
			}
		}
	}

	public selectSmartAccount (saId: number) {
		window.localStorage.setItem(ACTIVE_SMART_ACCOUNT_KEY, `${saId}`);
		window.location.reload();
	}
}
