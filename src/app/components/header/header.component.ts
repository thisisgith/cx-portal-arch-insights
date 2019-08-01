import { Component, OnDestroy } from '@angular/core';
import { MicroMockService } from '@cui-x-views/mock';
import { Subject } from 'rxjs';
import { User } from '@interfaces';
import { UserResolve } from '@utilities';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { ContactSupportComponent } from '../contact-support/contact-support.component';

/**
 * Main Header Component
 */
@Component({
	selector: 'app-header',
	styleUrls: ['./header.component.scss'],
	templateUrl: './header.component.html',
})
export class HeaderComponent implements OnDestroy {

	public user: User;
	public cxLevel: number;
	public name: string;
	private destroyed$: Subject<void> = new Subject<void>();

	constructor (
		private mockService: MicroMockService,
		private userResolve: UserResolve,
		private cuiModalService: CuiModalService,
	) {
		this.userResolve.getUser()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((user: User) => {
			this.user = user;

			this.cxLevel = _.get(this.user, ['service', 'cxLevel'], 0);
			this.name = _.get(this.user, ['info', 'individual', 'name'], '');
		});
	}

	/**
	 * Open the settings for the mock component
	 */
	public openMockModal () {
		this.mockService.promptMockSettings();
	}

	/**
	 * Handler for destroying the component
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * Open contact support modal
	 */
	public openPortalSupport () {
		this.cuiModalService.showComponent(ContactSupportComponent, { });
	}
}
