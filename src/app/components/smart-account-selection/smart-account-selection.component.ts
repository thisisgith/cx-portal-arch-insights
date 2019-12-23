import { Component, OnInit } from '@angular/core';
import { get } from 'lodash-es';

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
	public accountWithError: string;

	public ngOnInit () {
		this.accountWithError = this.data.isError && get(this.data, 'selectedSmartAccount.companyName', '');
	}

	public selectSmartAccount (saId: number) {
		window.localStorage.setItem(ACTIVE_SMART_ACCOUNT_KEY, `${saId}`);
		window.location.reload();
	}
}
