import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';

/** Service for communication among insights tabs. */
@Injectable({
	providedIn: 'root',
})
export class InsightsUtilService {

	public filterCollapseState = new ReplaySubject<boolean>(1);

	/**
	 * Returns the current state of Visual Filter toggle
	 * @returns the observable representing the filterCollapse
	 */
	public getFilterCollapseState (): Observable<any> {
		return this.filterCollapseState.asObservable();
	}

	/**
	 * Sends out an update for the current state of Visual Filter toggle
	 * @param filterCollapse the filter state to send
	 */
	public sendFilterCollapseState (filterCollapse: boolean) {
		this.filterCollapseState.next(filterCollapse);
	}

}
