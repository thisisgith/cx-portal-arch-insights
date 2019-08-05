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
import { ArchitectureService } from '@sdp-api';
import { Subject, Observable,Subscription, forkJoin, fromEvent, of } from 'rxjs';

import { VisualFilter } from '@interfaces';
import { map, catchError } from 'rxjs/operators';
import * as _ from 'lodash-es';


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
	public severityType:any = [];
	public newarray:any = [];

	public visualLabels:any = [
		{label: "Configuration Best Practices Exceptions", active:true, count:null, route:"Exceptions"},
		{label:"Assets With Exceptions", active:false, count:null,route:"AssetsWithExceptions"},
	];
	
	constructor (private logger: LogService,private architectureService : ArchitectureService ) {
		this.logger.debug('ArchitectureComponent Created!');	
		
	}

	// subfilter(event:any){
	// 	console.log(event.filter);
	// }

	ngOnInit(): void {
		
		this.architectureService.getExceptionsCount().subscribe(res => {
			console.log(res);
			this.visualLabels[0].count = res.CBPRulesCount;
			this.severityType = Object.keys(res).filter(obj => obj!=Object.keys(res)[1]);
			this.SeverityCount = Object.values(res).filter(obj => obj!=Object.values(res)[1]);
			
			this.SeverityCount.forEach((element,i) => {
				this.newarray.push(element +'<br>'+ this.severityType[i]);
			});
			// console.log(this.newarray);
			// this.buildGraph();
		});

		this.architectureService.getAssetsExceptionsCount().subscribe(res =>{
			console.log(res);
			// this.AssetsExceptionsCount = res.AssestsExceptionCount;
			 this.visualLabels[1].count = res.AssetsExceptionCount;
		});

		this.buildFilters();
	}

	selectVisualLabel(i:any){
		this.visualLabels.forEach(element => {
			element.active=!element.active;
		});
	}

	public filters: VisualFilter[];
	
	public status = {
		inventoryLoading: true,
		isLoading: true,
	};

	@ViewChild('exceptionsFilter', { static: true })
		private exceptionsFilterTemplate: TemplateRef<{ }>;
	/**
	 * Initializes our visual filters
	 * @param tab the tab we're building the filters for
	 */
	private buildFilters () {
		this.filters = [
			{
				key: 'Exceptions',
				loading: true,
				selected: true,
				seriesData: [],
				template: this.exceptionsFilterTemplate,
				title: "",
			}
			
		];
		this.loadData();
	}

	/**
	 * Adds a subfilter to the given filer
	 * @param subfilter the subfilter selected
	 * @param filter the filter we selected the subfilter on
	 * @param reload if we're reloading our assets
	 */
	public onSubfilterSelect (subfilter: string, filter: VisualFilter) {
		console.log(subfilter);
		let severity = subfilter
		console.log(filter);
		const sub = _.find(filter.seriesData, { filter: subfilter });
		if (sub) {
			sub.selected = !sub.selected;
		}

		this.architectureService.setAssetsExceptionCountSubjectObj(severity);

		filter.selected = _.some(filter.seriesData, 'selected');
		console.log(filter.selected);
	}


	/**
	 * Fetches the exception counts for the visual filter
	 * @returns the edvisory counts
	 */
	private getExceptionsCount () {
		const exceptionFilter = _.find(this.filters, { key: 'Exceptions' });

		return this.architectureService.getExceptionsCount()
		.pipe(
			map((data: any) => {
				const series = [];

				const HighRisk = _.get(data, 'HighRisk');

				if (HighRisk && HighRisk > 0) {
					series.push({
						filter: 'HighRisk',
						label: 'HighRisk',
						selected: false,
						value: HighRisk,
					});
				}

				const MediumRisk = _.get(data, 'MediumRisk');

				if (MediumRisk && MediumRisk > 0) {
					series.push({
						filter: 'MediumRisk',
						label: 'MediumRisk',
						selected: false,
						value: MediumRisk,
					});
				}

				const LowRisk = _.get(data, 'LowRisk');

				if (LowRisk && LowRisk > 0) {
					series.push({
						filter: 'LowRisk',
						label: 'LowRisk',
						selected: false,
						value: LowRisk,
					});
				}

				exceptionFilter.seriesData = series;
				exceptionFilter.loading = false;
			}),
			catchError(err => {
				exceptionFilter.loading = false;
				this.logger.error('architecture.component : getExceptionsCount() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}


	/**
	 * Function used to load all of the data
	 */
	private loadData () {
		this.status.isLoading = true;
		forkJoin(
			 this.getExceptionsCount(),
			
		)
		.pipe(
			map(() => {
				// if (this.assetParams.contractNumber) {
				// 	this.selectSubFilters(this.assetParams.contractNumber, 'contractNumber');
				// }

				// TODO: Add handler for EOX <- when api supports it
				// TODO: Add handler for advisories <- when API supports it

				// return this.InventorySubject.next();
			}),
		)
		.subscribe(() => {
			this.status.isLoading = false;

			if (window.Cypress) {
				window.loading = false;
			}

			this.logger.debug('architecture.component : loadData() :: Finished Loading');
		});
	}

}
