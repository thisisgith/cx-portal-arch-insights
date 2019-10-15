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

/**
 * Compare Recommendations Component
 */
@Component({
	selector: 'compare-recommendations',
	styleUrls: ['./compare-recommendations.component.scss'],
	templateUrl: './compare-recommendations.component.html',
})
export class CompareRecommendationsComponent implements OnChanges {
	@Input() public recommendations: MachineRecommendations[];
	@Input() public selectedSoftwareGroup: SoftwareGroup;
	@Output() public onAction = new EventEmitter();
	@Output() public showVersions = new EventEmitter();
	@Output() public showDetails = new EventEmitter();
	public currentRecommendation: MachineRecommendations;
	public machineRecommendations: MachineRecommendations[];
	public barChartBackgroundColor = '#f2f2f2';
	public barChartWidth = 130;
	public currentBarChartWidth = 180;
	public severityMap = {
		H: I18n.get('_OsvH_'),
		M: I18n.get('_OsvM_'),
		L: I18n.get('_OsvL_'),
	};

	/**
	 * lifecycle hook
	 * @param changes inputs value changes
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const recommendations = _.get(changes, ['recommendations', 'currentValue']);
		if (recommendations) {
			this.formatData(recommendations);
		}
	}

	/**
	 * formats data received from the api
	 * @param recommendations machine recommendations
	 */
	public formatData (recommendations) {
		_.map(recommendations, (recommendation: MachineRecommendations) => {
			const openBugs = _.get(recommendation, ['bugSeverity', 'OPEN']);
			const newOpenBugs = _.get(recommendation, ['bugSeverity', 'NEW_OPEN']);
			const resolvedBugs = _.get(recommendation, ['bugSeverity', 'RESOLVED']);

			const openBugsResponse = this.addOpen(openBugs, newOpenBugs);
			recommendation.bugsExposed = openBugsResponse.totalOpenCount;
			recommendation.openBugsCount = this.calculateExposed(openBugs);
			recommendation.newOpenBugsCount = this.calculateExposed(newOpenBugs);
			recommendation.resolvedBugsCount = this.calculateExposed(resolvedBugs);
			recommendation.bugSeriesData = openBugsResponse.totalOpenCount > 0
				? this.populateBarGraphData(openBugsResponse.totalOpen) : [];
			recommendation.totalBugsSeverity = this.addAll(openBugs, newOpenBugs, resolvedBugs);

			const openPsirts = _.get(recommendation, ['psirtSeverity', 'OPEN']);
			const newOpenPsirts = _.get(recommendation, ['psirtSeverity', 'NEW_OPEN']);
			const resolvedPsirts = _.get(recommendation, ['psirtSeverity', 'RESOLVED']);

			const openPsirtsResponse = this.addOpen(openPsirts, newOpenPsirts);
			recommendation.psirtExposed = openPsirtsResponse.totalOpenCount;
			recommendation.openPsirtCount = this.calculateExposed(openPsirts);
			recommendation.newOpenPsirtCount = this.calculateExposed(newOpenPsirts);
			recommendation.psirtResolvedCount = this.calculateExposed(resolvedPsirts);
			recommendation.psirtSeriesData = openPsirtsResponse.totalOpenCount > 0 ?
				this.populateBarGraphData(openPsirtsResponse.totalOpen) : [];
			_.set(recommendation, 'actions', this.getRowActions(recommendation));
			recommendation.totalPsirtsSeverity =
				this.addAll(openPsirts, newOpenPsirts, resolvedPsirts);
		});
		this.currentRecommendation = _.get(_.filter(recommendations,
			(recomm: MachineRecommendations) => recomm.name === 'profile current'), 0);
		this.machineRecommendations = _.filter(recommendations,
			(recomm: MachineRecommendations) => recomm.name !== 'profile current');
		this.sortData(this.machineRecommendations);
	}

	/**
	 * adds the total open bugs
	 * @param openBugs information about open bugs
	 * @param newOpenBugs information about newly open
	 * @param resolved information about resolved bugs
	 * @returns object containing the totalopencount
	 */
	public addAll (openBugs, newOpenBugs, resolved) {
		const total = { };
		_.map(_.keys(this.severityMap), (value: number) => {
			total[value] =
				_.get(openBugs, value, 0)
				+ _.get(newOpenBugs, value, 0)
				+ _.get(resolved, value, 0);
		});

		return total;
	}

	/**
	 * adds the total open bugs
	 * @param openBugs information about open bugs
	 * @param newOpenBugs information about newly open bugs
	 * @returns object containing the totalopencount
	 */
	public addOpen (openBugs, newOpenBugs) {
		const totalOpen = { };
		_.map(_.keys(this.severityMap), (value: number) => {
			totalOpen[value] = _.get(openBugs, value, 0) + _.get(newOpenBugs, value, 0);
		});
		const totalOpenCount = this.calculateExposed(totalOpen);
		return { totalOpenCount, totalOpen };
	}

	/**
	 * calculate the number of exposed bugs
	 * @param data machine recommention severity info
	 * @returns the number of bugs exposed
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
	 * @param severityInfo machine recommention severity info
	 * @returns seriesData for bar Chart
	 */
	public populateBarGraphData (severityInfo: any) {
		const data = severityInfo;
		if (_.keys(data).length > 0) {
			_.map(_.keys(this.severityMap), (value: number) => {
				data[value] = data[value] || 0;
			});
		}

		return _.compact(
			_.map(data, (value: number, key: string) => {
				if (!_.isNull(value)) {
					return {
						value,
						label: this.severityMap[key],
					};
				}
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
		this.onAction.emit({ version, type: 'accept' });
	}

	/**
	 * emit the cancelled version
	 * @param version cancelled version
	 */
	public onCancelClick (version: string) {
		this.onAction.emit({ version, type: 'cancel' });
	}

	/**
	 * Returns the row specific actions
	 * @param recomm the row we're building our actions for
	 * @returns the built actions
	 */
	public getRowActions (recomm: MachineRecommendations) {
		return [
			{
				label: _.upperCase(I18n.get('_Cancel_')),
				onClick: () => {
					this.onCancelClick(recomm.swVersion);
				},
			},
		];
	}

	/**
	 * show details of bugs
	 * @param viewType specifies whether to open bugs or psirts details
	 * @param tabIndex specifies which tab to open on bugs or psirts details
	 */
	public showDetailsView (viewType: string, tabIndex: number) {
		this.showDetails.emit({ viewType , tabIndex });
	}

}
