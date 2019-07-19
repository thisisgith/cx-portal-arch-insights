import { Component, OnInit, TemplateRef } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { Chart } from 'angular-highcharts';
import { readlinkSync } from 'fs';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	Router,
	Event as RouterEvent,
	NavigationEnd,
} from '@angular/router';


@Component({
	selector: 'app-architecture',
	styleUrls: ['./architecture.component.scss'],
	templateUrl: './architecture.component.html',
})
export class ArchitectureComponent implements OnInit {

	public tabIndex = 0;
	activeRoute: any;
	

	constructor (private logger: LogService,) {
		this.logger.debug('ArchitectureComponent Created!');
		
	}

	ngOnInit(): void {
		this.buildGraph();
	}
	// @ViewChild('ExceptionFacet', { static: true }) public ExceptionFacetTemplate: TemplateRef<{ }>;
	// @ViewChild('AssetWithExceptionFacet', { static: true }) public AssetWithExceptionFacetTemplate: TemplateRef<{ }>;

	

	
	public chart: Chart;
	// public facets: Facet[];
	

	// private initializeFacets () {
		// this.facets = [
		// 	{
		// 		key: 'Exceptions',
		// 		route: '/solution/lifecycle',
		// 		template: this.ExceptionFacetTemplate,
		// 		title: I18n.get('_Lifecycle_'),
		// 	},
		// 	{
		// 		key: 'Assets With Exceptions',
		// 		route: '/solution/assets',
		// 		template: this.AssetWithExceptionFacetTemplate,
		// 		title: I18n.get('_Assets&Coverage_'),
		// 	}
			
		// ];

		// if (this.activeRoute) {
		// 	this.selectFacet(_.find(this.facets, { route: this.activeRoute }));
		// }
	// }

	// public selectFacet (facet: Facet) {
	// 	if (facet) {
	// 		this.facets.forEach((f: Facet) => {
	// 			if (f !== facet) {
	// 				f.selected = false;
	// 			}
	// 		});

	// 		facet.selected = true;
	// 		this.selectedFacet = facet;

			// if (facet.route && this.activeRoute !== facet.route) {
			// 	this.activeRoute = facet.route;
			// 	this.router.navigate([facet.route]);
			// }
			// if (this.selectedSolution) {
			// 	this.solutionService.sendCurrentSolution(this.selectedSolution);

			// 	if (this.selectedTechnology) {
			// 		this.solutionService.sendCurrentTechnology(this.selectedTechnology);
			// 	}
			// }
	// 	}
	// }

		/**
	 * Builds our bar graph
	 */
	private buildGraph () {
		const data = [1000,2000];
		const categories = ['1000 <br> Medium Risk','2000 <br> High Risk'];
		// _.each(this.seriesData, d => {
		// 	data.push({
		// 		name: d.label,
		// 		y: d.y,
		// 	});

		// 	categories.push(d.label);
		// });

		this.chart = new Chart({
			chart: {
				height: 100,
				type: 'bar',
				width: 300,
			},
			credits: {
				enabled: false,
			},
			plotOptions: {
				series: {
					point: {
						events: {
							click: event => this.selectSubfilter(event),
						},
					},
				},
			},
			series: [
				{
					data,
					name: '',
					showInLegend: false,
					type: undefined,
				},
			],
			title: {
				text: null,
			},
			xAxis: {
				categories,
			},
			yAxis: {
				visible: false,
			},
		});
	}

	/**
	 * Emits the subfilter selected
	 * @param event highcharts click event
	 */
	public selectSubfilter (event: any) {
		event.stopPropagation();
		// const filterName = _.find(this.seriesData, { label: event.point.name }).filter;
		// this.subfilter.emit(filterName);
	}

	/**
	 * OnChanges Functionality
	 * @param changes The changes found
	 */
	// public ngOnChanges (changes: SimpleChanges) {
	// 	const seriesInfo = _.get(changes, 'seriesData',
	// 		{ currentValue: null, firstChange: false });
	// 	if (seriesInfo.currentValue && !seriesInfo.firstChange) {
	// 		this.buildGraph();
	// 	}
	// }

	public setTabIndex(tab) {
			this.tabIndex = tab;
	}
}
