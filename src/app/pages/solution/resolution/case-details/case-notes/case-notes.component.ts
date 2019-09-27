import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from '@cisco-ngx/cui-auth';

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

	constructor (
		private profileService: ProfileService,
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
				(a, b) => <any> new Date(b.createdDate) - <any> new Date(a.createdDate),
			);

			const userDetails = this.profileService.getProfile().cpr;
			this.caseNotes.forEach((i: any) => {
				if (i.createdByID.toLowerCase() === userDetails.pf_auth_uid.toLowerCase()) {
					i.createdBy = 'You';
				}
			});
		}
	}
}
