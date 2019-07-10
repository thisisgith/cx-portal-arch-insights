import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service which helps in refreshing notes list if a new note is added
 */
@Injectable({
	providedIn: 'root',
})
export class CaseDetailsService {
	private _addNoteSource = new BehaviorSubject<boolean>(false);
	public addNote$ = this._addNoteSource.asObservable();

	/**
	 * new note is added
	 * @param refresh true if add notes refresh is required
	 */
	public refreshNotesList (refresh) {
		this._addNoteSource.next(refresh);
	}
}
