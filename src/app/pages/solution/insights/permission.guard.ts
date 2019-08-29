/* tslint:disable */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RccService } from '@sdp-api';
import { UserResolve } from '@utilities';
import { map, flatMap } from 'rxjs/operators';
/**
 *  Injectable declaration
 */
@Injectable({
	providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
	constructor (private rccService: RccService,
	private userResolve: UserResolve,
	private router: Router) { }
	/**
	 * canActivate method execution
	 * @param next is next
	 * @param state is state
	 * @returns can activate boolean value
	 */
	public canActivate (
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> {
		return this.userResolve.getCustomerId()
		.pipe(
			flatMap(id => { return this.rccService.checkPermissions({ customerId: id });
		}),
		map((response: boolean) => {
			if (response) {
				return true;
			} else {
				this.router.navigateByUrl('/solution/insights/risk-mitigation');
				return false;
			}
		})
	)}
}
