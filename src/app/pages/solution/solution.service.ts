import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HardwareInfo } from '@cui-x/sdp-api';

/**
 * Interface representing a Use Case
 */
export interface UseCase {
	key: string;
	selected: boolean;
	title: string;
}

/**
 * Interface representing a solution
 */
export interface Solution {
	disabled?: boolean;
	key: string;
	selected: boolean;
	title: string;
}

/**
 * Service which represents our senders and listeners for UseCases Solutions and selected Hardware
 */
@Injectable({
	providedIn: 'root',
})
export class SolutionService {

	private currentUseCase = new Subject<UseCase>();
	private currentSolution = new Subject<Solution>();
	private currentAsset = new Subject<HardwareInfo>();

	/**
	 * Returns the currently selected use case
	 * @returns the observable representing the use case
	 */
	public getCurrentUseCase (): Observable<UseCase> {
		return this.currentUseCase.asObservable();
	}

	/**
	 * Returns the currently selected solution
	 * @returns the observable representing the solution
	 */
	public getCurrentSolution (): Observable<Solution> {
		return this.currentSolution.asObservable();
	}

	/**
	 * Returns the currently selected asset
	 * @returns the observable representing the asset
	 */
	public getCurrentAsset (): Observable<HardwareInfo> {
		return this.currentAsset.asObservable();
	}

	/**
	 * Sends out an update for the currently selected solution
	 * @param solution the solution to send
	 */
	public sendCurrentSolution (solution: Solution) {
		this.currentSolution.next(solution);
	}

	/**
	 * Sends out an update for the currently selected use case
	 * @param useCase the use case to send
	 */
	public sendCurrentUseCase (useCase: UseCase) {
		this.currentUseCase.next(useCase);
	}

	/**
	 * Sends out an update for the currently selected asset
	 * @param asset the asset to send
	 */
	public sendCurrentAsset (asset: HardwareInfo) {
		this.currentAsset.next(asset);
	}

}
