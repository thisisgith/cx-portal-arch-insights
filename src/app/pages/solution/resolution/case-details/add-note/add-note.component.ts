import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CaseService } from '@cui-x/services';
import { Case, Note } from '@interfaces';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CaseDetailsService } from 'src/app/services/case-details';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

/**
 * Add Notes Component
 */
@Component({
	selector: 'app-add-note',
	styleUrls: ['./add-note.component.scss'],
	templateUrl: './add-note.component.html',
})
export class AddNoteComponent {

	@Input('case') public case: Case;
	@Output('close') public close = new EventEmitter<boolean>();
	public titleMaxLength = 80;
	public descriptionMaxLength = 32000;
	public loading = false;
	public title: FormControl = new FormControl('',
		[
			Validators.required,
			Validators.maxLength(this.titleMaxLength),
		]);
	public description: FormControl = new FormControl('',
		[
			Validators.required,
			Validators.maxLength(this.descriptionMaxLength),
		]);
	public notesForm: FormGroup;
	private destroy$ = new Subject();

	constructor (
		private caseService: CaseService, private caseDetailsService: CaseDetailsService,
	) { }

	/**
 	* OnInit lifecycle hook
 	*/
	public ngOnInit () {
		this.notesForm = new FormGroup({
			description: this.description,
			title: this.title,
		});
	}

	/**
 	* adds case notes
 	* @returns status of response
 	*/
	public addCaseNote () {
		this.loading = true;
		const body: Note = {
			createdBy: 'Charlene Hall',
			createdByID: 'charhall',
			note: this.title.value,
			noteDetail: this.description.value,
			noteStatus: 'external',
			noteType: 'WEB UPDATE',
		};

		return this.caseService.addCaseNote(this.case.caseNumber, body)
		.pipe(
			takeUntil(this.destroy$),
		)
			.subscribe(
				(response: any) => {
					this.loading = false;
					// success and error scenarios to be handled
					if (response && response.status === 'SUCCESS') {
						this.caseDetailsService.refreshNotesList(true);
						this.title.setValue('');
						this.description.setValue('');
						this.close.emit(true);
					}
				});
	}

	/**
	 * Hide the addNote popup
	 */
	public hide () {
		this.close.emit(true);
	}
}
