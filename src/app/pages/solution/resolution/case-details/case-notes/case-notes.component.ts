import { Component, OnInit, Input } from '@angular/core';

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
		}
	}
}
