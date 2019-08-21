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
}
