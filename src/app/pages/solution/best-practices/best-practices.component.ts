import { Component, OnInit } from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import { LogService } from '@cisco-ngx/cui-services';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import * as _ from 'lodash-es';

/**
 * Interface representing a subModule
 */
interface SubModule {
	key: string;
	label?: string;
	route: string;
	selected?: boolean;
}

/**
 * Best Practices Component
 */
@Component({
	selector: 'app-best-practices',
	styleUrls: ['./best-practices.component.scss'],
	templateUrl: './best-practices.component.html',
})
export class BestPracticesComponent implements OnInit {
	public subModules: SubModule[];
	public selectedSubModule: SubModule;
	private activeRoute: string;
	private eventsSubscribe: Subscription;

	constructor (
		private router: Router,
		private logger: LogService,
	) {
		this.eventsSubscribe = this.router.events.subscribe(
			(event: RouterEvent): void => {
				if (event instanceof NavigationEnd && event.url) {
					const route = _.split(
						(_.isArray(event.url) ? event.url[0] : event.url), '?')[0];
					if (route.includes('best-practices')) {
						this.activeRoute = route;
						const routeSubModule = _.find(this.subModules, { route });
						if (routeSubModule) {
							this.selectSubModule(routeSubModule);
						}
					}
				}
			},
		);
	}

	/**
	 * OnInit Functionality
	 */
	public ngOnInit () {
		this.initializeSubModules();
	}

	/**
	 * Used to initialise our submodules
	 */
	public initializeSubModules () {
		this.subModules = [
			{
				key: 'osv',
				label: I18n.get('_Software_'),
				route: '/solution/best-practices/optimal-software-version',
				selected: true,
			},
			{
				key: 'risk-migitation',
				label: I18n.get('_RiskMitigation_'),
				route: '/solution/best-practices/risk-mitigation',
				selected: false,
			},
			{
				key: 'architecture',
				label: I18n.get('_Architecture_'),
				route: '/solution/best-practices/architecture',
				selected: false,
			},
		];
	}

	/**
	 * Change the selected subModule
	 * @param subModule the subModule we've clicked on
	 */
	public selectSubModule (subModule: SubModule) {
		if (subModule) {
			this.subModules.forEach((s: SubModule) => {
				if (s !== subModule) {
					s.selected = false;
				}
			});

			subModule.selected = true;
			this.selectedSubModule = subModule;

			if (subModule.route && this.activeRoute !== subModule.route) {
				this.activeRoute = subModule.route;
				this.router.navigate([subModule.route]);
			}
		}
	}

	/**
	 * Handler for clean up on component destruction
	 */
	public ngOnDestroy () {
		if (this.eventsSubscribe) {
			_.invoke(this.eventsSubscribe, 'unsubscribe');
		}
	}

}
