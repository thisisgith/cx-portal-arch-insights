import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CuiModalService, CuiModalContent } from '@cisco-ngx/cui-components';

@Component({
	selector: 'app-contact-support',
	styleUrls: ['./contact-support.component.scss'],
	templateUrl: './contact-support.component.html',
})
export class ContactSupportComponent implements CuiModalContent {

	public toggle = false;
	public supportForm: FormGroup;
	public data: any;
	public title: FormControl = new FormControl('', Validators.required);
	public description: FormControl = new FormControl('', Validators.required);
	public items: any[] = [
		{
			name: 'Item One',
			value: 1,
		},
		{
			name: 'Item Two',
			value: 2,
		},
	];

	constructor (
		public cuiModalService: CuiModalService,
	) { }

	public ngOnInit () {
		this.supportForm = new FormGroup({
			description: this.description,
			title: this.title,
		});
	}

	public onSelection () {
		console.log(this.title.value);
	}

	public submitMessage () {
		if (this.supportForm.valid) {
			this.toggle = !this.toggle;
		}
	}
}
