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
export class ArchitectureComponent implements OnInit {

	public tabIndex = 0;
	activeRoute: any;
	public severityObj = {};
	public AssetsExceptionsCount:any;

	public SeverityCount:any = [];
	public severityType:any = []
	public newarray:any = [];
	
	constructor (private logger: LogService,private architectureService : ArchitectureService ) {
		this.logger.debug('ArchitectureComponent Created!');	
	}

	ngOnInit(): void {

		this.architectureService.getExceptionsCount().subscribe(res => {
			this.severityType = Object.keys(res).filter(obj => obj!=Object.keys(res)[1]);
			this.SeverityCount = Object.values(res).filter(obj => obj!=Object.values(res)[1]);
			
			this.SeverityCount.forEach((element,i) => {
				this.newarray.push(element +'<br>'+ this.severityType[i]);
			});
			console.log(this.newarray);
			this.buildGraph();
		});

		this.architectureService.getAssetsExceptionsCount().subscribe(res =>{
			this.AssetsExceptionsCount = res.AssestsExceptionCount;
		});
	}

	public chart: Chart;
	/**
	 * Builds our bar graph
	 */
	private buildGraph () {
		const data = this.SeverityCount;
		const categories = this.newarray;
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
		 this.severityObj = {severity : event.point.category.split('<br>')[1]};
		 console.log(this.severityObj);
		
		 this.architectureService.setAssetsExceptionCountSubjectObj(this.severityObj);
		 //event.stopPropagation();
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

	// public setTabIndex(tab) {
	// 		this.tabIndex = tab;
	// }
}
