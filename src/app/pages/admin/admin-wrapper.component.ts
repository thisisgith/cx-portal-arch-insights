import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AppService } from 'src/app/app.service';

import * as _ from 'lodash-es';

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
		private router: Router,
		private route: ActivatedRoute,
		public appService: AppService,
	) {
		this.routerPath = _.get(this, 'route.snapshot.routeConfig.path', 'settings');
	}

	/**
	 * Goes back to the previous page
	 */
	public goBack () {
		let lastRoute = this.appService.popRoute();
		lastRoute = lastRoute ? lastRoute : '';

		while (lastRoute.includes('admin')) {
			lastRoute = this.appService.popRoute();
			lastRoute = lastRoute ? lastRoute : '';
		}

		this.router.navigateByUrl(lastRoute);
	}
}
