import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CaseService } from '@cui-x/services';
import { Case, Note } from '@interfaces';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CaseDetailsService } from 'src/app/services/case-details';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ProfileService } from '@cisco-ngx/cui-auth';

import * as _ from 'lodash-es';

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
		private profileService: ProfileService,
	) { }

	/**
 	* OnInit lifecycle hook
 	*/
	public ngOnInit () {
		this.notesForm = new FormGroup({
			description: this.description,
			title: this.title,
		});
		this.notesForm.controls.title.valueChanges.subscribe(value => {
			if (this.notesForm.controls.title.dirty && _.trim(value).length === 0) {
				this.notesForm.controls.title.setErrors({ titleEmpty : true });
			}
		});
		this.notesForm.controls.description.valueChanges.subscribe(value => {
			if (this.notesForm.controls.description.dirty && _.trim(value).length === 0) {
				this.notesForm.controls.description.setErrors({ descriptionEmpty : true });
			}
		});
	}

	/**
 	* adds case notes
 	* @returns status of response
 	*/
	public addCaseNote () {
		this.loading = true;
		const userDetails = this.profileService.getProfile().cpr;
		const body: Note = {
			createdBy: `${userDetails.pf_auth_firstname} ${userDetails.pf_auth_lastname}`,
			createdByID: userDetails.pf_auth_uid,
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
