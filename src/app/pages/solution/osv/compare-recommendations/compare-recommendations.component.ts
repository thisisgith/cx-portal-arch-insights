import {
	Component,
	Input,
	Output,
	OnChanges,
	SimpleChanges,
	EventEmitter,
} from '@angular/core';

import { MachineRecommendations, SoftwareGroup } from '@sdp-api';
import * as _ from 'lodash-es';
import { I18n } from '@cisco-ngx/cui-utils';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Compare Recommendations Component
 */
@Component({
	templateUrl: './compare-recommendations.component.html',
	selector: 'compare-recommendations',
	styleUrls: ['./compare-recommendations.component.scss']
})
export class CompareRecommendationsComponent implements  OnChanges {
	@Input() public recommendations: MachineRecommendations[];
	@Input() public selectedSoftwareGroup: SoftwareGroup;
	@Output() public onAction = new EventEmitter();
	public currentRecommendation: MachineRecommendations;
	public machineRecommendations: MachineRecommendations[];
	public barChartBackgroundColor = '#f2fbfd';

	constructor (private logger: LogService) {
		this.logger.debug('CompareRecommendationsComponent Created!');
	}

	/**
	 * lifecycle hook
	 * @param changes inputs value changes
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const recommendations = _.get(changes, ['recommendations', 'currentValue']);
		if (recommendations) {
			this.formatData();
		}
	}

	/**
	 * formats data received from the api
	 */
	public formatData () {
		_.map(this.recommendations, (recommendation: MachineRecommendations) => {
			const resolvedBugs =_.get(recommendation, ['bugSeverity.RESOLVED']);
			const resolvedPsirts =_.get(recommendation, ['bugSeverity.RESOLVED']);
			recommendation.score = _.isNumber(recommendation.score) ? 
				recommendation.score.toFixed() : recommendation.score;
			recommendation.bugsExposed = this.calculateExposed(resolvedBugs);
			recommendation.psirtExposed = this.calculateExposed(resolvedBugs);
			recommendation.bugSeriesData = this.populateBarGraphData(resolvedPsirts);
			recommendation.psirtSeriesData = this.populateBarGraphData(resolvedPsirts);
		});
		this.currentRecommendation = _.get(_.filter(this.recommendations,
			(recomm: MachineRecommendations) => recomm.name === 'profile current'), 0);
		this.machineRecommendations = _.filter(this.recommendations,
			(recomm: MachineRecommendations) => recomm.name !== 'profile current');
		this.sortData(this.machineRecommendations);
	}

	/**
	 * calculate the number of exposed bugs
	 * @param data machine recommention severity info
	 */
	public calculateExposed (data: any): any {
		if (_.keys(data).length > 0) {

			return Object.values(data)
				.reduce((a: number, b: number) => a + b);
		}

		return 0;
	}

	/**
	 * add graph data
	 * @param data machine recommention severity info
	 */
	populateBarGraphData (data: any) {
		if (_.keys(data).length > 0) {
			data = {
				High: data.High || 0,
				Critical: data.Critical || 0,
				Low: data.Low || 0,
			};
		}

		return _.compact(
			_.map(data, (value: number, key: string) => {
				key = key.toLowerCase();

				return {
					value,
					filter: key,
					label: key === 'critical' ?
						I18n.get('_OsvCritical_')
						: key === 'high' ? I18n.get('_OsvHigh_') : I18n.get('_OsvLow_'),
					selected: false,
				};
			}));
	}

	/**
	 * Sort Machine Recommendations by name
	 * @param data MachineRecommendations
	 * @returns sorted data
	 */
	public sortData (data: MachineRecommendations[]) {
		data.sort((a: MachineRecommendations, b: MachineRecommendations) =>
			<any> new Date(a.name) - <any> new Date(b.name));

		return data;
	}

	/**
	 * emit the accept action
	 * @param version accepted version
	 */
	public onAcceptClick (version: string) {
		this.onAction.emit({ type: 'accept', version: version });
	}

	/**
	 * emit the cancelled version
	 * @param version cancelled version
	 */
	public onCancelClick (version: string) {
		this.onAction.emit({ type: 'cancel', version: version });
	}
}
