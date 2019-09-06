import {
	Component,
	Output,
	Input,
	EventEmitter,
	OnChanges,
	SimpleChanges,
	ViewChild,
	TemplateRef,
} from '@angular/core';
import { AssetRecommendations, SoftwareGroup } from '@sdp-api';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Software Group Recommendations Component
 */
@Component({
	selector: 'software-group-recommendations',
	styleUrls: ['./software-group-recommendations.component.scss'],
	templateUrl: './software-group-recommendations.component.html',
})
export class SoftwareGroupRecommendationsComponent implements OnChanges {
	@ViewChild('actionsTemplate', { static: true }) private actionsTemplate: TemplateRef<{ }>;
	@ViewChild('versionTemplate', { static: true }) private versionTemplate: TemplateRef<{ }>;
	@ViewChild('currentTemplate', { static: true }) private currentTemplate: TemplateRef<{ }>;
	@ViewChild('releaseDateTemplate', { static: true })
	private releaseDateTemplate: TemplateRef<{ }>;
	@Input() public recommendations: AssetRecommendations[];
	@Input() public selectedSoftwareGroup: SoftwareGroup;
	@Output() public onAction = new EventEmitter();
	@Output() public showVersions = new EventEmitter();
	public groupRecommendationsTable: CuiTableOptions;
	public currentRecommendation: AssetRecommendations;
	public groupRecommendations: AssetRecommendations[];
	constructor (private logger: LogService) {
		this.logger.debug('SoftwareGroupRecommendationsComponent Created!');
	}

	/**
	 * lifecycle hook
	 * @param changes change in inputs
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const recommendations = _.get(changes, ['recommendations', 'currentValue']);
		if (recommendations) {
			this.groupRecommendations = this.groupData(recommendations);
			this.buildTable();
		}
	}

	/**
	 * trigger the accept action
	 * @param version accepted version
	 */
	public onAcceptClick (version: string) {
		this.onAction.emit({ version, type: 'accept' });
	}

	/**
	 * trigger the cancelled action
	 * @param version cancelled version
	 */
	public onCancelClick (version: string) {
		this.onAction.emit({ version, type: 'cancel' });
	}

	/**
	 * Sort Asset Recommendations by postDate
	 * @param data AssetDetails
	 * @returns sorted data
	 */
	public sortData (data: AssetRecommendations[]) {
		data.sort((a: AssetRecommendations, b: AssetRecommendations) =>
			<any> new Date(b.postDate) - <any> new Date(a.postDate));

		return data;
	}

	/**
	 * add tooltip info for recommended versions
	 * @param data the asset recommendations
	 */
	public addVersionInfo (data: AssetRecommendations[]) {
		_.map(data, (detail: AssetRecommendations) => {
			switch (detail.name) {
				case 'latest':
					detail.info = I18n.get('_OsvLatestInfo_');
					break;
				case 'current':
					detail.info = I18n.get('_OsvCurrentInfo_');
					break;
				case 'suggested':
					detail.info = I18n.get('_OsvSuggestedInfo_');
					break;
				case 'minimum':
					detail.info = I18n.get('_OsvMinimumInfo_');
					break;
				case 'golden':
					detail.info = I18n.get('_OsvGoldenInfo_');
					break;
				case 'Recommendation #1':
				case 'Recommendation #2':
				case 'Recommendation #3':
					detail.info = I18n.get('_OsvRecommendedInfo_');
					break;
				default:
					break;
			}
		});
	}

	/**
	 * View All Os Version - link to software.cisco.com
	 */
	public viewAllVersions () {
		const mdfId = _.get(this.selectedSoftwareGroup, 'mdfId');
		const url = `https://software.cisco.com/research/home?pid=${mdfId}`;
		window.open(`${url}`, '_blank');
	}

	/**
	 * Table view for basic recommendations
	 */
	public buildTable () {
		if (!this.groupRecommendationsTable) {
			this.groupRecommendationsTable = new CuiTableOptions({
				bordered: true,
				columns: [
					{
						sortable: false,
						template: this.currentTemplate,
						width: '20%',
					},
					{
						name: I18n.get('_OsvVersion_'),
						sortable: false,
						template: this.versionTemplate,
						width: '35%',
					},
					{
						key: 'postDate',
						name: I18n.get('_OsvReleaseDate_'),
						sortable: false,
						template: this.releaseDateTemplate,
						width: '15%',
					},
					{
						name: I18n.get('_OsvStatusOrAction_'),
						sortable: false,
						template: this.actionsTemplate,
						width: '30%',
					},
				],
				dynamicData: true,
				hover: true,
				padding: 'compressed',
				selectable: false,
				singleSelect: false,
				sortable: true,
				striped: false,
				wrapText: true,
			});
		}
	}

	/**
	 * group recommendations based on version
	 * @param data Recommendations
	 * @returns grouped data
	 */
	public groupData (data: AssetRecommendations[]) {
		this.addVersionInfo(data);
		const recommendations = _.filter(data, (detail: AssetRecommendations) =>
			detail.name !== 'profile current');
		const groups = _.groupBy(recommendations, 'swVersion');
		const groupedData = [];
		_.map(_.keys(groups), swVersion => {
			const detail: AssetRecommendations = _.get(_.filter(recommendations, { swVersion }), 0);
			detail.swVersionGroup = _.cloneDeep(groups[swVersion]);
			groupedData.push(detail);
		});
		this.currentRecommendation = _.get(_.filter(data, { name: 'profile current' }), 0);

		return this.sortData(groupedData);
	}

}
