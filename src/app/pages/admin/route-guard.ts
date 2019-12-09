import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserResolve } from '@utilities';
import { User } from '@interfaces';
import * as _ from 'lodash-es';
import { map, catchError } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class RouteGuard implements CanActivate {
	constructor (private userResolve: UserResolve, private router: Router) { }

	public canActivate (): Observable<boolean> {

		const admin = 'accountadmin';

		return this.userResolve.getUser()
			  .pipe(
		map((user: User) => {
			const isAdmin = _.get(user, ['info', 'individual', 'role']);
			const cxLevel = _.get(user, ['service', 'cxLevel']);
			 if (isAdmin.toLowerCase() === admin && (cxLevel > 1)) {
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
