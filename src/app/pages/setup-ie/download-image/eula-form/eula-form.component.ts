import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Input data for this component
 */
export interface EulaFormData {
	checkboxDescription: string;
	label: string;
}

/**
 * Component for the EULA form
 */
@Component({
	selector: 'eula-form',
	styleUrls: ['./eula-form.component.scss'],
	templateUrl: './eula-form.component.html',
})
export class EULAFormComponent implements OnDestroy {
	@Input() public downloadSessionId: string;
	@Input() public loading: boolean;
	@Input() public eulaData: Partial<EulaFormData> = { };
	@Output() public loadingChange: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() public onDownload: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() public onDecline: EventEmitter<boolean> = new EventEmitter<boolean>();
	private destroyed$: Subject<void> = new Subject<void>();
	public acceptedEULA: boolean;

	/**
	 * Whether or not the DOWNLOAD IMAGE button should be disabled
	 */
	public get isDisabled () {
		return !this.acceptedEULA;
	}

	/**
	 * NgOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * Handler for click event on DOWNLOAD IMAGE button
	 */
	public onDownloadImage () {
		this.onDownload.emit();
	}

	/**
	 * Declines the eula
	 */
	public decline () {
		this.onDecline.emit();
	}
}
