import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import * as _ from 'lodash-es';

/**
 * SoftwareProfileDetail Component
 */
@Component({
	selector: 'app-software-profile-detail',
	styleUrls: ['./software-profile-detail.component.scss'],
	templateUrl: './software-profile-detail.component.html',
})
export class SoftwarProfileDetailComponent implements OnInit {
	@ViewChild('currentBugs', { static: true })
	private currentBugsTemplate: TemplateRef<{}>;
	@ViewChild('recBugs', { static: true })
	private recBugsTemplate: TemplateRef<{}>;

	constructor (private logger: LogService, ) {
		this.logger.debug('SoftwareProfileDetailComponent Created!');
	}
	recommendations = [];
	compareHeader = {};
	barChartData = [
		{
			filter: 'high',
			label: 'H',
			selected: false,
			value: 10,
		},
		{
			filter: 'medium',
			label: 'm',
			selected: false,
			value: 5,
		},
		{
			filter: 'low',
			label: 'L',
			selected: false,
			value: 2,
		}
	]

	ngOnInit (): void {
		const data = [
			{
				key: 'current',
				releaseVersion: '3',
				riskScore: '35%',
			},
			{
				key: 'recommendation1',
				releaseVersion: '8.8.100.9',
				releaseDate: '2018-08-08',
				riskScore: '10%',
			},
			{
				key: 'recommendation2',
				releaseVersion: '8.8.101.9',
				releaseDate: '2018-09-09',
				riskScore: '15%',
			},
			{
				key: 'recommendation3',
				releaseVersion: '8.8.101.9',
				releaseDate: '2018-09-09',
				riskScore: '15%',
			}
		];
		this.formatData(data);
	}

	/**
	 * format data
	 */
	formatData (data: any) {
		const current = _.filter(data, { key: 'current' });
		const recommendation1 = _.filter(data, { key: 'recommendation1' });
		const recommendation2 = _.filter(data, { key: 'recommendation2' });
		const recommendation3 = _.filter(data, { key: 'recommendation3' });
		this.compareHeader = {
			label: '',
			current: 'Current',
			rec1: 'Recommendation #1',
			rec2: 'Recommendation #2',
			rec3: 'Recommendation #3',
		};

		this.recommendations.push({
			key: 'releaseVersion',
			label: 'Release Version',
			current: _.get(current, ['0', 'releaseVersion']),
			rec1: _.get(recommendation1, ['0', 'releaseVersion']),
			rec2: _.get(recommendation2, ['0', 'releaseVersion']),
			rec3: _.get(recommendation3, ['0', 'releaseVersion']),
		});
		this.recommendations.push({
			key: 'releaseDate',
			label: 'Release Date',
			current: _.get(current, ['0', 'releaseDate']),
			rec1: _.get(recommendation1, ['0', 'releaseDate']),
			rec2: _.get(recommendation2, ['0', 'releaseDate']),
			rec3: _.get(recommendation3, ['0', 'releaseDate']),
		});
		this.recommendations.push({
			key: 'riskScore',
			label: 'Risk Score',
			current: _.get(current, ['0', 'riskScore']),
			rec1: _.get(recommendation1, ['0', 'riskScore']),
			rec2: _.get(recommendation2, ['0', 'riskScore']),
			rec3: _.get(recommendation3, ['0', 'riskScore']),
		});
		this.recommendations.push({
			currentTemplate: this.currentBugsTemplate,
			recTemplate: this.recBugsTemplate,
			key: 'riskScore',
			label: 'Bugs',
			current: _.get(current, ['0', 'bugs']),
			rec1: _.get(recommendation1, ['0', 'bugs']),
			rec2: _.get(recommendation2, ['0', 'bugs']),
			rec3: _.get(recommendation3, ['0', 'bugs']),
		});
	}
}
