import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
	RacetrackSolution,
	RacetrackTechnology,
	Asset,
} from '@sdp-api';

/**
 * Service which represents our senders and listeners for UseCases Solutions and selected Hardware
 */
@Injectable({
	providedIn: 'root',
})
export class SolutionService {

	private currentTechnology = new Subject<RacetrackTechnology>();
	private currentSolution = new Subject<RacetrackSolution>();
	private currentAsset = new Subject<Asset>();

	/**
	 * Returns the currently selected use case
	 * @returns the observable representing the use case
	 */
	public getCurrentTechnology (): Observable<RacetrackTechnology> {
		return this.currentTechnology.asObservable();
	}

	/**
	 * Returns the currently selected solution
	 * @returns the observable representing the solution
	 */
	public getCurrentSolution (): Observable<RacetrackSolution> {
		return this.currentSolution.asObservable();
	}

	/**
	 * Returns the currently selected asset
	 * @returns the observable representing the asset
	 */
	public getCurrentAsset (): Observable<Asset> {
		return this.currentAsset.asObservable();
	}

	/**
	 * Sends out an update for the currently selected solution
	 * @param solution the solution to send
	 */
	public sendCurrentSolution (solution: RacetrackSolution) {
		this.currentSolution.next(solution);
	}

	/**
	 * Sends out an update for the currently selected technology
	 * @param technology the technology to send
	 */
	public sendCurrentTechnology (technology: RacetrackTechnology) {
		this.currentTechnology.next(technology);
	}

	/**
	 * Sends out an update for the currently selected asset
	 * @param asset the asset to send
	 */
	public sendCurrentAsset (asset: Asset) {
		this.currentAsset.next(asset);
	}
}
