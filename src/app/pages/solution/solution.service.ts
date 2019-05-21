import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import {
	Solution,
	UseCase,
} from './solution.component';

/**
 * Interface representing the inventory results
 */
@Injectable({
	providedIn: 'root',
})
export class SolutionService {

	private currentUseCase = new Subject<UseCase>();
	private currentSolution = new Subject<Solution>();

	/**
	 * Get the current selected use case
	 * @returns the current use case as an observable
	 */
	public getCurrentUseCase (): Observable<UseCase> {
		return this.currentUseCase.asObservable();
	}

	/**
	 * Get the current selected solution
	 * @returns the current solution as an observable
	 */
	public getCurrentSolution (): Observable<Solution> {
		return this.currentSolution.asObservable();
	}

	/**
	 * Send out update for current solution
	 * @param solution the solution to send
	 */
	public sendCurrentSolution (solution: Solution) {
		this.currentSolution.next(solution);
	}

	/**
	 * Sent out update for use case
	 * @param useCase the usecase to send
	 */
	public sendCurrentUseCase (useCase: UseCase) {
		this.currentUseCase.next(useCase);
	}

}
