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
	public solutionDropdown = false;
	public useCaseDropdown = false;

	public selectedFacet: Facet;

	/** Temporary until we figure out what this is supposed to look like */
	public useCases = {
		ACI: [],
		COLLAB: [],
		IBN: [
			'Wireless Assurance',
			'SD Access',
			'Automation',
		],
		SECURITY: [],
	};

	/** Temporary until we figure out what this is supposed to look like */
	public solutions = [
		{
			key: 'IBN',
			selected: true,
			title: '_IBN_',
		},
		{
			key: 'ACI',
			selected: false,
			title: '_ACI_',
		},
		{
			key: 'COLLAB',
			selected: false,
			title: '_Collab_',
		},
		{
			key: 'SECURITY',
			selected: false,
			title: '_Security_',
		},
	];
	public selectedSolution = this.solutions[0];
	public selectedUseCase = 'Wireless Assurance';
	private activeRoute: string;
	public facets: Facet[];
	private eventsSubscribe: Subscription;

	@ViewChild('advisoriesFact') public advisoriesTemplate: TemplateRef<{ }>;
	@ViewChild('assetsFacet') public assetsTemplate: TemplateRef<{ }>;
	@ViewChild('lifecycleFacet') public lifecycleTemplate: TemplateRef<{ }>;
	@ViewChild('resolutionFacet') public resolutionTemplate: TemplateRef<{ }>;
	@ViewChild('securityFacet') public securityTemplate: TemplateRef<{ }>;

	constructor (
		private router: Router,
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
	 * OnInit Functionality
	 */
	public ngOnInit () {
		this.initializeFacets();
	}

	/**
	 * Handles unsubscribing from observables
	 */
	public ngOnDestroy () {
		if (this.eventsSubscribe) {
			this.eventsSubscribe.unsubscribe();
		}
	}
}
