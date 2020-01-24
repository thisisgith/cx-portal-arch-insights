import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserResolve } from '@utilities';
import { User } from '@interfaces';
import * as _ from 'lodash-es';
import { map, catchError } from 'rxjs/operators';
import { UserRoles } from '@constants';

@Injectable({
	providedIn: 'root',
})
export class RouteGuard implements CanActivate {
	public settingsWhitelist = [UserRoles.SA_ADMIN, UserRoles.VA_ADMIN];
	constructor (private userResolve: UserResolve, private router: Router) { }

	public canActivate (): Observable<boolean> {

		return this.userResolve.getUser()
			  .pipe(
		map((user: User) => {
			const cxLevel = _.get(user, ['service', 'cxLevel']);
			 if ({ whitelistRoles: this.settingsWhitelist } && (cxLevel > 1)) {
			 	return true;
			 }
			this.router.navigate(['/admin/policies']);

		}),
				catchError(() => {
					this.router.navigate(['/admin/policies']);

					return of(false);
				}),
			);
	}

}
