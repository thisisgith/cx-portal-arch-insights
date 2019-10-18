import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SetupIEStateService } from '../../setup-ie-state.service';
import { KEY_CODES } from '@classes';

/**
 * Custom Validator for IP Address
 * @param control {AbstractControl}
 * @returns function
 */
function validateIpAddress (control: AbstractControl) {
	const error = { value: 'Invalid IP Address Error' };
	const regexMatch = control.value
		&& control.value.match(/(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/);
	if (!regexMatch) { return error; }
	let hasError = false;
	regexMatch.slice(1, 5)
		.forEach(elem => {
			const num = parseInt(elem, 10);
			if (isNaN(num) || num > 255) { hasError = true; }
		});
	if (hasError) { return error; }

	return null;
}

/**
 * ConnectComponent
 */
@Component({
	selector: 'connect',
	styleUrls: ['./connect.component.scss'],
	templateUrl: './connect.component.html',
})
export class ConnectComponent implements OnInit {
	@Output() public onContinue: EventEmitter<void> = new EventEmitter<void>();
	@Output() public onTutorial: EventEmitter<void> = new EventEmitter<void>();
	public showTutorialLink: boolean;
	public accountForm = new FormGroup({
		ipAddress: new FormControl(null, [
			Validators.required,
			validateIpAddress,
		]),
	});
	public get ipAddress () {
		return this.accountForm.get('ipAddress').value;
	}

	constructor (
		private router: Router,
		private state: SetupIEStateService,
	) { }

	/**
	 * Submits the user input IP Address
	 */
	public async onSubmit () {
		const state = this.state.getState() || { };
		state.collectorIP = this.ipAddress;
		this.state.setState(state);
		await this.router.navigate([], {
			queryParams: {
				collectorIP: this.ipAddress,
			},
			queryParamsHandling: 'merge',
		});
		this.onContinue.emit();
	}

	/**
	 * Emits a tutorial click event
	 */
	public onTutorialClick () {
		this.onTutorial.emit();
	}

	/**
	 * Listen for ENTER key events and page to next page
	 * @param event incoming keyboard event
	 */
	@HostListener('window:keyup', ['$event'])
	public keyEvent (event: KeyboardEvent) {
		if (event.keyCode === KEY_CODES.ENTER && this.accountForm.valid) {
			this.onSubmit();
		}
	}

	/**
	 * NgOnInit
	 */
	public ngOnInit () {
		const state = this.state.getState();
		this.showTutorialLink = state.compKey <= 1;
		state.downloadView = 'connect';
		this.state.setState(state);
		this.router.navigate([], {
			queryParams: {
				downloadView: 'connect',
			},
			queryParamsHandling: 'merge',
		});
	}
}
