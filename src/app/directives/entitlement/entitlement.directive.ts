import {
	Directive,
	TemplateRef,
	ViewContainerRef,
	Input,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { RoleListsAndLevel } from '@interfaces';
import { Subscription } from 'rxjs';
import { LogService } from '@cisco-ngx/cui-services';
import { EntitlementUtilityService } from '@services';
import { first } from 'rxjs/operators';

/**
 * Directive to allow rendering based on the `whitelistRoles` and `blacklistRoles` lists
 * and `cxLevel` against the users role and level. Both roles and levels are optional but one must be specified.
 * `whitelistRoles` and `blacklistRoles` are exclusive of each other and can only be used one at a time.
 *
 * Usage:
 * *auth="{
 * 		whitelistRoles?: string[] | string,
 * 		blacklistRoles?: string[] | string,
 * 		cxLevel?: number
 * }"
 */
@Directive({
	selector: '[auth]',
})
export class EntitlementDirective implements OnInit, OnDestroy {
	@Input() public auth: RoleListsAndLevel;

	private entitlementUtilSubscription: Subscription;

	constructor (
		private templateRef: TemplateRef<object>,
		private viewContainer: ViewContainerRef,
		private entitlementUtil: EntitlementUtilityService,
		private logger: LogService,
	) { }

	/**
	 * createViewIfAuthorized
	 *
	 * Param isAuthorized is passed in as a boolean from the call back
	 * of EntitlementUtilityService when it checks against the user auth
	 * if authorized it creates the element in the embedded viewContainer
	 * if not it clears it if it existed before and does not create a new one
	 *
	 * @param isAuthorized: boolean
	 */
	private createViewIfAuthorized = ({ isAuthorized }): void => {
		if (isAuthorized) {
			this.viewContainer.createEmbeddedView(this.templateRef);
		} else {
			this.viewContainer.clear();
		}
	}

	/**
	 * Compares roles from the EntitlementDirective's input object to the users role gotten from
	 * the UserResolve service
	 */
	private checkRolesListsAndLevel = (): void => {
		const { whitelistRoles, blacklistRoles, cxLevel } = this.auth;

		this.entitlementUtilSubscription = this.entitlementUtil
			.getUserCheckLevelAndRole({
				cxLevel,
				whitelistRoles,
				blacklistRoles,
			})
			.pipe(first())
			.subscribe(
				this.createViewIfAuthorized,
				err => {
					this.logger.error(err);
				},
			);
	}

	public ngOnInit (): void {
		this.checkRolesListsAndLevel();
	}

	/**
	 * Unsubscribes from the UserResolve subscription
	 */
	public ngOnDestroy (): void {
		if (this.entitlementUtilSubscription) {
			this.entitlementUtilSubscription.unsubscribe();
		}
	}
}
