import { Component, OnDestroy } from '@angular/core';
import { AssetsState } from '../assets-state.service';
import { Observable, of, Subject } from 'rxjs';

/**
 * Counts for each reachability status
 */
interface Reachability {
	count: number;
	label: 'Reachable' | 'Connecting' | 'Unreachable' | 'Authentication Failed';
	percentage: number;
}

/**
 * AssetTotalComponent
 */
@Component({
	host: {
		class: 'flex-fill',
	},
	selector: 'reachability-chart',
	styleUrls: ['./reachability-chart.component.scss'],
	templateUrl: './reachability-chart.component.html',
})
export class ReachabilityChartComponent implements OnDestroy {
	private destroyed$: Subject<void> = new Subject<void>();
	public counts$: Observable<Reachability[]> = of(<Reachability[]> [
		{
			count: 3055,
			label: 'Reachable',
			percentage: Math.ceil(3055 / 4530 * 100),
		},
		{
			count: 4,
			label: 'Connecting',
			percentage: Math.ceil(4 / 4530 * 100),
		},
		{
			count: 1203,
			label: 'Unreachable',
			percentage: Math.ceil(1203 / 4530 * 100),
		},
		{
			count: 268,
			label: 'Authentication Failed',
			percentage: Math.ceil(268 / 4530 * 100),
		},
	]);

	constructor (
		private state: AssetsState,
	) { }

	/**
	 * NgOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
