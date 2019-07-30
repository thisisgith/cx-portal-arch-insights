import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { HttpRequest, HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { LogService } from '@cisco-ngx/cui-services';
import { environment } from '@environment';
/**
 * Service which helps in refreshing notes list if a new note is added
 */
@Injectable({
	providedIn: 'root',
})
export class CaseDetailsService {
	private _addNoteSource = new BehaviorSubject<boolean>(false);
	public addNote$ = this._addNoteSource.asObservable();
	private caseFilesUrl = `${environment.origin}${environment.csc.fileList}`;

	constructor (
		private http: HttpClient, private logger: LogService,
	) { }

	/**
	 * new note is added
	 * @param refresh true if add notes refresh is required
	 */
	public refreshNotesList (refresh) {
		this._addNoteSource.next(refresh);
	}

	/**
	 * Fetch files data
	 * @param caseNo for files
	 * @returns Observable with response data.
	 */
	public getCaseFiles (caseNo) {
		const req = new HttpRequest<any>(
			'GET',
			`${this.caseFilesUrl}/${caseNo}`,
		);

		return this.http.request<any>(req)
			.pipe(
				map((res: any) => res.body),
				catchError(err => {
					this.logger.error('casedetails.component : getCaseFiles() ' +
						`:: Error : (${err.status}) ${err.message}`);
					return of({ });
				}),
			);
	}
}
