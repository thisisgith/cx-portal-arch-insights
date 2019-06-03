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
import { HardwareInfo } from '@cui-x/sdp-api';
import { Solution, SolutionService, UseCase } from './solution.service';

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
 * Interface representing the use cases object
 */
interface UseCases {
	aci: UseCase[];
	collab: UseCase[];
	ibn: UseCase[];
	security: UseCase[];
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
	public useCases: UseCases = {
		aci: [
			{
				key: 'someKey',
				selected: false,
				title: '_Placeholder_',
			},
		],
		collab: [],
		ibn: [
			{
				key: 'assurance',
				selected: true,
				title: '_WirelessAssurance_',
			},
			{
				key: 'sd-access',
				selected: false,
				title: '_SDAccess_',
			},
			{
				key: 'automation',
				selected: false,
				title: '_Automation_',
			},
		],
		security: [],
	};

	/** Temporary until we figure out what this is supposed to look like */
	public solutions: Solution[] = [
		{
			key: 'ibn',
			selected: true,
			title: '_IBN_',
		},
		{
			disabled: true,
			key: 'aci',
			selected: false,
			title: '_ACI_',
		},
		{
			disabled: true,
			key: 'collab',
			selected: false,
			title: '_Collab_',
		},
		{
			disabled: true,
			key: 'security',
			selected: false,
			title: '_Security_',
		},
	];
	public selectedSolution = this.solutions[0];
	public selectedUseCase = this.useCases[this.selectedSolution.key][0];
	private activeRoute: string;
	public facets: Facet[];
	public selectedAsset: HardwareInfo;
	private eventsSubscribe: Subscription;
	private assetSubscribe: Subscription;

	@ViewChild('advisoriesFact') public advisoriesTemplate: TemplateRef<{ }>;
	@ViewChild('assetsFacet') public assetsTemplate: TemplateRef<{ }>;
	@ViewChild('lifecycleFacet') public lifecycleTemplate: TemplateRef<{ }>;
	@ViewChild('resolutionFacet') public resolutionTemplate: TemplateRef<{ }>;
	@ViewChild('securityFacet') public securityTemplate: TemplateRef<{ }>;

	constructor (
		private router: Router,
		private solutionService: SolutionService,
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

				if (this.selectedUseCase) {
					this.solutionService.sendCurrentUseCase(this.selectedUseCase);
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
	 * Change our use case
	 * @param useCase the use case
	 */
	public changeUseCase (useCase: UseCase) {
		const solution = _.get(_.find(this.solutions, 'selected'), 'key');

		if (solution) {
			_.each(this.useCases[solution], (uc: UseCase) => {
				uc.selected = false;
			});
		}

		this.selectedUseCase = useCase;
		useCase.selected = true;
		this.solutionService.sendCurrentUseCase(useCase);
	}

	/**
	 * Change the solution
	 * @param solution the selected solution
	 */
	public changeSolution (solution: Solution) {
		_.each(this.solutions, (s: Solution) => {
			s.selected = false;
			_.each(this.useCases[s.key], (uc: UseCase) => {
				uc.selected = false;
			});
		});

		this.selectedSolution = solution;
		solution.selected = true;
		this.solutionService.sendCurrentSolution(solution);
		const topUseCase = this.useCases[solution.key][0];
		if (topUseCase) {
			this.changeUseCase(topUseCase);
		}
	}

	/**
	 * OnInit Functionality
	 */
	public ngOnInit () {
		this.initializeFacets();

		this.solutionService.sendCurrentSolution(this.selectedSolution);
		this.solutionService.sendCurrentUseCase(this.selectedUseCase);
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
