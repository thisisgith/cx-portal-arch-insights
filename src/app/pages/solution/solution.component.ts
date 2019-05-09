import {
	Component,
	OnInit,
	TemplateRef,
	ViewChild,
} from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import { Router } from '@angular/router';

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
export class SolutionComponent implements OnInit {

	public shownTabs = 5;
	public solutionDropdown = false;
	public useCaseDropdown = false;

	public selectedFacet: Facet;

	@ViewChild('advisoriesFact') public advisoriesTemplate: TemplateRef<{ }>;
	@ViewChild('assetsFacet') public assetsTemplate: TemplateRef<{ }>;
	@ViewChild('lifecycleFacet') public lifecycleTemplate: TemplateRef<{ }>;
	@ViewChild('resolutionFacet') public resolutionTemplate: TemplateRef<{ }>;
	@ViewChild('securityFacet') public securityTemplate: TemplateRef<{ }>;

	constructor (
		private router: Router,
	) { }

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
	public facets: Facet[];

	/**
	 * Change the selected fact
	 * @param facet the facet we've clicked on
	 */
	public selectFacet (facet: Facet) {
		this.facets.forEach((f: Facet) => {
			if (f !== facet) {
				f.selected = false;
			}
		});

		facet.selected = true;
		this.selectedFacet = facet;

		if (facet.route) {
			this.router.navigate([facet.route]);
		}
	}

	/**
	 * OnInit Functionality
	 */
	public ngOnInit () {
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

		this.selectFacet(this.facets[0]);
	}
}
