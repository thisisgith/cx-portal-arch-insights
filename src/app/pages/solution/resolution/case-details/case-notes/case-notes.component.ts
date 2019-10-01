import { Component, OnInit, Input } from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';
import { ActivatedRoute } from '@angular/router';

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
	public ccoId: string;

	constructor (
		private route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.ccoId = _.get(user, ['info', 'individual', 'ccoId'], '');
	}

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
				(a, b) => <any> new Date(b.createdDate) - <any> new Date(a.createdDate),
			);

			this.caseNotes.forEach((note: any) => {
				if (note.createdByID.toLowerCase() === this.ccoId.toLowerCase()) {
					note.createdBy = I18n.get('_RMACaseYou_');
				}
			});
		}
	}
}
