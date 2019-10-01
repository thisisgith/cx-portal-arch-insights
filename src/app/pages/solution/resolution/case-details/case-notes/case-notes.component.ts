import { Component, OnInit, Input } from '@angular/core';
import { UserResolve } from '@utilities';
import { User } from '@interfaces';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';

/**
 * Case Notes Component
 */
@Component({
	selector: 'app-case-notes',
	styleUrls: ['./case-notes.component.scss'],
	templateUrl: './case-notes.component.html',
})

export class CaseNotesComponent implements OnInit {

	@Input() public caseNotes: any;
	private destroy$ = new Subject();

	constructor (
		private userResolve: UserResolve,
	) { }

	/**
	 * Initialization hook
	 */
	public ngOnInit () {
		this.getSortedNotes();
	}

	/**
	 * sorts case notes
	 */
	public getSortedNotes () {
		if (this.caseNotes && this.caseNotes.length > 0) {
			this.caseNotes.sort(
				(a, b) => <any>new Date(b.createdDate) - <any>new Date(a.createdDate),
			);

			this.userResolve.getUser()
				.pipe(
					takeUntil(this.destroy$),
				)
				.subscribe((user: User) => {
					const ccoId = _.get(user, ['info', 'individual', 'ccoId'], '');

					this.caseNotes.forEach((note: any) => {
						if (note.createdByID.toLowerCase() === ccoId.toLowerCase()) {
							note.createdBy = I18n.get('_RMACaseYou_');
						}
					});
				});
		}
	}
}
