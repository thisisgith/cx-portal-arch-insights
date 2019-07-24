import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';

/**
 * Admin Component
 */
@Component({
	selector: 'admin-wrapper',
	styleUrls: ['./admin-wrapper.component.scss'],
	templateUrl: './admin-wrapper.component.html',
})
export class AdminWrapperComponent {
	public routerPath;
	private destroyed$: Subject<void> = new Subject<void>();

	constructor (
		private location: Location,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.routerPath = this.route.snapshot.routeConfig.path;
	}

	/**
	 * Goes back to the previous page
	 */
	public goBack () {
		// TODO: It might be better to only go back when the previous location is part of this App.
		// If not, it should navigate to the home page. We would have to start storing the previous
		// location in a service to accomplish this.
		this.location.back();
	}

	/**
	 * Go to a route
	 * @param path string
	 */
	public goTo (path: string) {
		this.router.navigate(['admin', path]);
	}

}
