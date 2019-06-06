import {
	Component,
	OnInit,
	TemplateRef,
	ViewChild,
	OnDestroy,
} from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	Router,
	Event as RouterEvent,
	NavigationEnd,
} from '@angular/router';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import {
	HardwareInfo,
	RacetrackService,
	RacetrackResponse,
	RacetrackSolution,
	RacetrackTechnology,
} from '@cui-x/sdp-api';
import { SolutionService } from './solution.service';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Interface representing a facet
 */
interface Facet {
	route: string;
	selected?: boolean;
	template: TemplateRef<{ }>;
	title: string;
}

/**
 * Solution Page
 */
@Component({
	styleUrls: ['./solution.component.scss'],
	templateUrl: './solution.component.html',
})
export class SolutionComponent implements OnInit, OnDestroy {

	public shownTabs = 5;
	public selectedFacet: Facet;
	public selectedSolution: RacetrackSolution;
	public selectedTechnology: RacetrackTechnology;

	public status = {
		dropdowns: {
			solution: false,
			technology: false,
		},
		loading: false,
	};
	private activeRoute: string;
	public facets: Facet[];
	public selectedAsset: HardwareInfo;
	private eventsSubscribe: Subscription;
	private assetSubscribe: Subscription;
	public solutions: RacetrackSolution[];

	@ViewChild('advisoriesFact') public advisoriesTemplate: TemplateRef<{ }>;
	@ViewChild('assetsFacet') public assetsTemplate: TemplateRef<{ }>;
	@ViewChild('lifecycleFacet') public lifecycleTemplate: TemplateRef<{ }>;
	@ViewChild('resolutionFacet') public resolutionTemplate: TemplateRef<{ }>;
	@ViewChild('securityFacet') public securityTemplate: TemplateRef<{ }>;

	constructor (
		private router: Router,
		private solutionService: SolutionService,
		private racetrackService: RacetrackService,
		private logger: LogService,
	) {
		this.eventsSubscribe = this.router.events.subscribe(
			(event: RouterEvent): void => {
				if (event instanceof NavigationEnd && event.url) {
					const route = (_.isArray(event.url)) ? event.url[0] : event.url;

					if (route.includes('solution')) {
						this.activeRoute = route;
						const routeFacet = _.find(this.facets, { route });
						if (routeFacet) {
							this.selectFacet(routeFacet);
						}
					}
				}
			},
		);

		this.assetSubscribe = this.solutionService.getCurrentAsset()
		.subscribe((asset: HardwareInfo) => {
			this.selectedAsset = asset;
		});
	}

	get technologies (): RacetrackTechnology[] {
		const name = _.get(this.selectedSolution, 'name');

		return _.get(_.find(this.solutions, { name }), 'technologies', []);
	}

	/**
	 * Change the selected fact
	 * @param facet the facet we've clicked on
	 */
	public selectFacet (facet: Facet) {
		if (facet) {
			this.facets.forEach((f: Facet) => {
				if (f !== facet) {
					f.selected = false;
				}
			});

			facet.selected = true;
			this.selectedFacet = facet;

			if (facet.route && this.activeRoute !== facet.route) {
				this.activeRoute = facet.route;
				this.router.navigate([facet.route]);
			}
			if (this.selectedSolution) {
				this.solutionService.sendCurrentSolution(this.selectedSolution);

				if (this.selectedTechnology) {
					this.solutionService.sendCurrentTechnology(this.selectedTechnology);
				}
			}
		}
	}

	/**
	 * Used to initialize our facets
	 */
	private initializeFacets () {
		this.facets = [
			{
				route: '/solution/lifecycle',
				template: this.lifecycleTemplate,
				title: I18n.get('_Lifecycle_'),
			},
			{
				route: '/solution/assets',
				template: this.assetsTemplate,
				title: I18n.get('_Assets&Coverage_'),
			},
			{
				route: '/solution/security',
				template: this.securityTemplate,
				title: I18n.get('_Security_'),
			},
			{
				route: '/solution/advisories',
				template: this.advisoriesTemplate,
				title: I18n.get('_Advisories_'),
			},
			{
				route: '/solution/resolution',
				template: this.resolutionTemplate,
				title: I18n.get('_ProblemResolution_'),
			},
		];

		if (this.activeRoute) {
			this.selectFacet(_.find(this.facets, { route: this.activeRoute }));
		}
	}

	/**
	 * Change our technology
	 * @param technology the technology
	 */
	public changeTechnology (technology: RacetrackTechnology) {
		this.selectedTechnology = technology;
		this.solutionService.sendCurrentTechnology(technology);
	}

	/**
	 * Change the solution
	 * @param solution the selected solution
	 */
	public changeSolution (solution: RacetrackSolution) {
		this.selectedSolution = solution;
		this.solutionService.sendCurrentSolution(solution);

		const topTechnology = _.head(_.get(this.selectedSolution, 'technologies', []));

		if (topTechnology) {
			this.changeTechnology(topTechnology);
		}
	}

	/**
	 * Will retrieve the solutions and associated use cases and build out the dropdowns
	 */
	private fetchSolutions () {
		this.status.loading = true;
		this.racetrackService.getRacetrack({ customerId: '2431199' })
		.subscribe((results: RacetrackResponse) => {
			this.solutions = results.solutions;
			this.changeSolution(_.head(this.solutions));
			this.status.loading = false;
		},
		err => {
			this.status.loading = false;
			this.logger.error('solution.component : fetchSolutions() ' +
				`:: Error : (${err.status}) ${err.message}`);
		});
	}

	/**
	 * OnInit Functionality
	 */
	public ngOnInit () {
		this.fetchSolutions();
		this.initializeFacets();
	}

	/**
	 * Handler for clean up on component destruction
	 */
	public ngOnDestroy () {
		if (this.eventsSubscribe) {
			_.invoke(this.eventsSubscribe, 'unsubscribe');
		}

		if (this.assetSubscribe) {
			_.invoke(this.assetSubscribe, 'unsubscribe');
		}
	}
}
