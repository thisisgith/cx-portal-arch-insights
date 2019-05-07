import {
	Component,
	Input,
	OnInit,
	Output,
	EventEmitter,
} from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import * as _ from 'lodash';
import {
	RacetrackPitstop,
	RacetrackTechnology,
	RacetrackResponseObject,
} from '@services';

/**
 * Interface for gauge panel component options
 */
export interface GaugePanelOptions {
	racetrackData: RacetrackResponseObject;
}

/**
 * Interface representing a Solution Tab
 */
interface Tab {
	name: string;
	percentComplete: number;
	selected: boolean;
	subTabs: SubTab[];
}

/**
 * Interface repreenting a technology subtab
 */
interface SubTab {
	gaugePercentage: number;
	selected: boolean;
	technology: RacetrackTechnology;
}

/**
 * Main gauge-panel component
 */
@Component({
	selector: 'gauge-panel',
	styleUrls: ['./gauge-panel.component.scss'],
	templateUrl: './gauge-panel.component.html',
})
export class GaugePanelComponent implements OnInit {

	/**
	 * Options passed to gauge panel component
	 */
	@Input() public options: GaugePanelOptions;

	/**
	 * Used for listening when a new technology is selected and outputs the current pitstop
	 */
	@Output() public onTechChange = new EventEmitter<RacetrackPitstop>();

	public tabs: Tab[] = [];
	public selectedTab: Tab;
	public subTab: SubTab;

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('GaugePanelComponent Created!');
	}

	/**
	 * Populates tabs based on Racetrack API Response
	 * @param data Racetrack API response
	 */
	private createTabs (data: RacetrackResponseObject) {
		data.solutions.forEach(solution => {
			const subTabs: SubTab[] = [];

			solution.technologies.forEach(technology => {
				const subTab: SubTab = {
					technology,
					gaugePercentage: this.calculateGaugePercentage(technology),
					selected: false,
				};
				subTabs.push(subTab);
			});

			const tab: Tab = {
				subTabs,
				name: solution.name,
				percentComplete: this.calculateSolutionPercentage(subTabs),
				selected: false,
			};

			this.tabs.push(tab);
		});
		this.selectTab(this.tabs[0]);
		this.selectSubTab(this.selectedTab.subTabs[0]);
	}

	/**
	 * Select a tab
	 * @param tab tab
	 */
	public selectTab (tab: Tab) {
		tab.selected = true;
		this.selectedTab = tab;
	}

	/**
	 * Calculates the percent of actions completed for a technology
	 * @param technology technology used to calculate percentage complete
	 * @returns calculated percented of actions complete
	 */
	private calculateGaugePercentage (technology: RacetrackTechnology) {
		const currentStop: RacetrackPitstop = _.find(technology.pitstops,
			{ name: technology.currentPitstop });
		const completedActions = _.filter(currentStop.pitstopActions, 'isComplete').length;

		return Math.floor((completedActions / currentStop.pitstopActions.length) * 100) || 0;
	}

	/**
	 * Calculates the percent of technologies complete for a solution
	 * @param subTabs a solutions subtabs of technologies
	 * @returns calculated percentage of completed technologies
	 */
	private calculateSolutionPercentage (subTabs: SubTab[]) {
		let sum = 0;
		subTabs.forEach(s => sum += s.gaugePercentage);

		return Math.floor(sum / subTabs.length) || 0;
	}

	/**
	 * Select a subtab
	 * @param subTab subtab to select
	 */
	public selectSubTab (subTab: SubTab) {
		this.selectedTab.subTabs.forEach(t => {
			if (t.technology.name !== subTab.technology.name) {
				t.selected = false;
			}
		});

		subTab.selected = true;
		this.subTab = (subTab.selected) ? subTab : undefined;
		this.subTab.technology.pitstops.forEach(p => {
			if (p.name === this.subTab.technology.currentPitstop) {
				this.onTechChange.emit(p);
			}
		});
	}

	/**
	 * Initializes tabs on component load
	 */
	public ngOnInit () {
		this.createTabs(this.options.racetrackData);
	}
}
