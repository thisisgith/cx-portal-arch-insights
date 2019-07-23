import { Component, OnInit, ViewChild,AfterViewInit, TemplateRef } from '@angular/core';
import { DevicesWithExceptionsComponent } from './devices-with-exceptions/devices-with-exceptions.component';
import { LogService } from '@cisco-ngx/cui-services';
import { Chart } from 'angular-highcharts';
import { readlinkSync } from 'fs';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	Router,
	Event as RouterEvent,
	NavigationEnd,
} from '@angular/router';
import { ArchitectureService } from '@cui-x/sdp-api';
import { Subject, Observable } from 'rxjs';


@Component({
	selector: 'app-architecture',
	styleUrls: ['./architecture.component.scss'],
	templateUrl: './architecture.component.html',
})
export class ArchitectureComponent implements OnInit,AfterViewInit {

	public tabIndex = 0;
	activeRoute: any;
	public severityObj = {};
	public AssetsExceptionsCount:any;
	CBPRiskArray:any = [];
	
	//  @ViewChild(DevicesWithExceptionsComponent,{static:true}) public DevicesException;
	constructor (private logger: LogService,private architectureService : ArchitectureService ) {
		this.logger.debug('ArchitectureComponent Created!');
		
	}

	ngOnInit(): void {
		
		this.architectureService.getMessage().subscribe(res => {
		this.AssetsExceptionsCount = res.count;
		})

		this.architectureService.getCBPRiskArray().subscribe(res => {
			console.log(res.CBPRisk);
			this.CBPRiskArray = res.CBPRisk;
			this.buildGraph();
		})
		
	}

	// public updateAssestsCount ($event) {
	// 	this.AssetsExceptionsCount = $event;
	// }


	ngAfterViewInit(){
		
		// this.AssetsExceptionsCount = this.DevicesException.AssetsWithExceptionsCount;
	}

	// @ViewChild('ExceptionFacet', { static: true }) public ExceptionFacetTemplate: TemplateRef<{ }>;
	// @ViewChild('AssetWithExceptionFacet', { static: true }) public AssetWithExceptionFacetTemplate: TemplateRef<{ }>;

	

	
	public chart: Chart;
	/**
	 * Builds our bar graph
	 */
	private buildGraph () {
		const data = this.CBPRiskArray;
		const categories = ['Medium Risk','High Risk'];
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
		// event.stopPropagation();

		 this.severityObj = {severity : event.point.category.split(' ')[0]};
		 console.log(this.severityObj);
		
		 this.architectureService.setAssetsExceptionCountSubjectObj(this.severityObj);
		// console.log(event.point.category.split(' ')[0]);
		// const filterName = _.find(this.seriesData, { label: event.point.name }).filter;
		// this.subfilter.emit(filterName);
	}

	// public getAssetsExceptionCountSubjectObj(){

	// }
	

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

	// public setTabIndex(tab) {
	// 		this.tabIndex = tab;
	// }
}
