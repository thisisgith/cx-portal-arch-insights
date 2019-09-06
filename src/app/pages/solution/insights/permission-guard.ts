import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserResolve } from '@utilities';
import { map, flatMap, catchError } from 'rxjs/operators';
import { RouteAuthService } from 'src/app/services';
/**
 *  Injectable declaration
 */
@Injectable({
	providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
	constructor (private routeAuthService: RouteAuthService,
		private userResolve: UserResolve,
		private router: Router) { }
	/**
	 * canActivate method execution
	 * @param _next is next
	 * @param _state is state
	 * @returns can activate boolean value
	 */
	public canActivate (
		_next: ActivatedRouteSnapshot,
		_state: RouterStateSnapshot): Observable<boolean> {
		return this.userResolve.getCustomerId()
			.pipe(flatMap(id => this.routeAuthService.checkPermissions(id)),
				map((response: boolean) => {

					if (response) {
						return true;
					}
					this.router.navigateByUrl('/solution/insights/risk-mitigation');

					return false;
				}),				
			);
	}
}
