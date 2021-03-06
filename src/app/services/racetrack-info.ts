import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { RacetrackResponse, RacetrackTechnology, RacetrackSolution } from '@sdp-api';

/** Service for fetching and updating racetrack information. */
@Injectable({
	providedIn: 'root',
})
export class RacetrackInfoService {

	private currentTechnology = new ReplaySubject<RacetrackTechnology>(1);
	private currentSolution = new ReplaySubject<RacetrackSolution>(1);
	public racetrack = new ReplaySubject<RacetrackResponse>(1);
	private currentAdoptionPercentage = new ReplaySubject<number>(1);
	public pitStopApiFailure = new ReplaySubject<any>(1);

	/**
	 * Returns the error when smartsheet for pitstop is not updated
	 * @returns the observable representing the error
	 */
	public getPitStopApiFailure (): Observable<any> {
		return this.pitStopApiFailure.asObservable();
	}

	/**
	 * Returns the currently selected solution
	 * @returns the observable representing the solution
	 */
	public getCurrentSolution (): Observable<RacetrackSolution> {
		return this.currentSolution.asObservable();
	}

	/**
	 * Returns the currently selected use case
	 * @returns the observable representing the use case
	 */
	public getCurrentTechnology (): Observable<RacetrackTechnology> {
		return this.currentTechnology.asObservable();
	}

	/**
	 * Returns the entire racetrack info
	 * @returns the observable representing all solutions
	 */
	public getRacetrack (): Observable<RacetrackResponse> {
		return this.racetrack.asObservable();
	}

	/**
	 * Returns the adopiton percentage
	 * @returns the observable representing adoption percentage
	 */
	public getCurrentAdoptionPercentage (): Observable<number> {
		return this.currentAdoptionPercentage.asObservable();
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
	 * Sends out an update for the entire racetrack
	 * @param racetrack the racetrack to send
	 */
	public sendRacetrack (racetrack: RacetrackResponse) {
		this.racetrack.next(racetrack);
	}

	/**
	 * Sends out an update adoption percertage
	 * @param adoptionPercentage  to send
	 */
	public sendCurrentAdoptionPercentage (adoptionPercentage: number) {
		this.currentAdoptionPercentage.next(adoptionPercentage);
	}

	/**
	 * Sends out the error message when smartsheet for pitstop is not updated
	 * @param err  error received from api
	 */
	public sendPitStopApiFailure (err: any) {
		this.pitStopApiFailure.next(err);
	}
}
