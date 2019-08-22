import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

/**
 * Input data for this component
 */
export interface K9FormData {
	acceptK9CheckboxText: string;
	ccoid: string;
	commOrCivText: string;
	countriesText: string;
	email: string;
	firstName: string;
	govOrMilText: string;
	k9FormText: string;
	lastName: string;
	noText: string;
	yesText: string;
}

/**
 * AcceptEmission
 */
export interface AcceptEmission {
	bizFnInput: 'civ' | 'gov';
	inCountryInput: 'Yes' | 'No';
}

/**
 * Component for the K9 form
 */
@Component({
	selector: 'k9-form',
	styleUrls: ['./k9-form.component.scss'],
	templateUrl: './k9-form.component.html',
})
export class K9FormComponent implements OnDestroy, OnInit {
	@Input() public loading: boolean;
	@Input() public k9Data: Partial<K9FormData> = { };
	@Output() public loadingChange: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() public onAccept: EventEmitter<AcceptEmission> = new EventEmitter<AcceptEmission>();
	@Output() public onDecline: EventEmitter<void> = new EventEmitter<void>();
	private destroyed$: Subject<void> = new Subject<void>();

	public acceptedSE = false;
	public businessFn: 'civ' | 'gov';
	public inCountry: 'Yes' | 'No';
	public error = false;
	public eulaFormText: string;

	public k9Form = new FormGroup({
		ccoid: new FormControl(),
		email: new FormControl(),
		firstName: new FormControl(),
		lastName: new FormControl(),
	});

	/**
	 * Whether or not the CONTINUE button should be disabled
	 */
	public get isDisabled () {
		return  !this.acceptedSE
			|| !this.businessFn
			|| (this.businessFn === 'gov' && !this.inCountry);
	}

	/**
	 * NgOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * NgOnInit
	 */
	public ngOnInit () {
		this.k9Form.get('firstName')
			.setValue(this.k9Data.firstName);
		this.k9Form.get('lastName')
			.setValue(this.k9Data.lastName);
		this.k9Form.get('email')
			.setValue(this.k9Data.email);
		this.k9Form.get('ccoid')
			.setValue(this.k9Data.ccoid);
	}

	/**
	 * Handler for Decline button click
	 */
	public decline () {
		this.onDecline.emit();
	}

	/**
	 * Handler for Accept button click
	 */
	public accept () {
		this.onAccept.emit({
			bizFnInput: this.businessFn,
			inCountryInput: this.inCountry,
		});
	}
}
