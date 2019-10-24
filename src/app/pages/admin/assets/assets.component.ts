import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssetsState } from './assets-state.service';
import { empty, Observable, Subject } from 'rxjs';
import {
	catchError, delay, filter, map, startWith, switchMap, takeUntil, tap,
} from 'rxjs/operators';
import {
	ControlPointDeviceDiscoveryAPIService,
	DeviceDetailsByPage,
	RacetrackSolution,
	RacetrackTechnology,
} from '@sdp-api';
import { RacetrackInfoService } from '@services';
import { User } from '@interfaces';
import * as _ from 'lodash-es';

/**
 * PaginationInfo Interface
 */
interface PaginationInfo {
	page: number;
	totalAssets: number;
}

/**
 * AdminAssetsComponent
 */
@Component({
	selector: 'admin-assets',
	templateUrl: './assets.component.html',
})
export class AdminAssetsComponent implements AfterViewInit, OnDestroy, OnInit {
	private destroyed$: Subject<void> = new Subject<void>();
	private page = 1;
	private totalAssets = 0;
	private getAssets$: Subject<DeviceDetailsByPage> =
		new Subject<DeviceDetailsByPage>();
	private user: User;
	private customerId: string;
	private solution: RacetrackSolution;
	private technology: RacetrackTechnology;
	public view$: Observable<'table' | 'grid'> = this.state.changes.pipe(
		startWith(this.state.currentState),
		filter(change => !_.isUndefined(change.view)),
		map(change => change.view),
		takeUntil(this.destroyed$),
	);
	public pagination$: Observable<PaginationInfo> = this.state.changes.pipe(
		startWith(this.state.currentState),
		filter(change => !_.isUndefined(change.page) || !_.isUndefined(change.totalAssets)),
		map(change => ({
			page: _.isUndefined(change.page) ? this.page : change.page,
			totalAssets: _.isUndefined(change.totalAssets) ? this.totalAssets : change.totalAssets,
		})),
		tap(info => {
			this.page = _.isUndefined(info.page) ? this.page : info.page;
			this.totalAssets = _.isUndefined(info.totalAssets)
				? this.totalAssets
				: info.totalAssets;
		}),
		takeUntil(this.destroyed$),
	);
	public isLoadingAssets$: Observable<boolean> = this.state.changes.pipe(
		startWith(this.state.currentState),
		filter(change => !_.isUndefined(change.isLoadingAssets)),
		map(change => change.isLoadingAssets),
		takeUntil(this.destroyed$),
	);

	constructor (
		private cdr: ChangeDetectorRef,
		private racetrackInfoService: RacetrackInfoService,
		private route: ActivatedRoute,
		private service: ControlPointDeviceDiscoveryAPIService,
		private state: AssetsState,
	) {
		this.user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(this.user, ['info', 'customerId']);
	}

	/**
	 * NgOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * NgOnInit
	 */
	public ngOnInit () {
		this.racetrackInfoService.getCurrentSolution()
			.pipe(takeUntil(this.destroyed$))
			.subscribe(solution => this.solution = solution);
		this.racetrackInfoService.getCurrentTechnology()
			.pipe(takeUntil(this.destroyed$))
			.subscribe(technology => this.technology = technology);
	}

	/**
	 * NgAfterViewInit
	 */
	public ngAfterViewInit () {
		this.getAssets$
			.pipe(
				delay(0),
				tap(() => {
					this.state.isLoadingAssets = true;
				}),
				switchMap(() => this.service
					.getDevicesUsingGET({
						customerId: this.customerId,
						pageNumber: String(this.state.page),
						rowsPerPage: '10',
						solution: this.solution.name,
						useCase: this.technology.name,
					})
					.pipe(
						catchError(() => {
							this.state.isLoadingAssets = false;

							return empty();
						}),
						takeUntil(this.destroyed$),
					),
				),
				takeUntil(this.destroyed$),
			)
			.subscribe(response => {
				this.state.page = response.pagination.pageNumber;
				this.state.displayedAssets = response.data.length;
				this.state.totalAssets = response.pagination.totalRows;

				this.state.assets = _.map(response.data, item => ({
					data: item,
				}));
				this.state.isLoadingAssets = false;
				this.cdr.detectChanges();
			});
		this.getAssets$.next();
	}

	/**
	 * Handles updating the state when the pager is clicked
	 * @param pagination - any
	 */
	public onPageChanged (pagination: any) {
		this.state.page = pagination.page + 1;
		this.getAssets$.next();
	}
}
