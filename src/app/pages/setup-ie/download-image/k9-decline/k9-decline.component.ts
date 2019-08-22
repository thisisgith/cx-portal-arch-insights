import {
	Component, EventEmitter, Input, OnDestroy, Output,
} from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Component for the K9 Decline form
 */
@Component({
	selector: 'k9-decline',
	styleUrls: ['./k9-decline.component.scss'],
	templateUrl: './k9-decline.component.html',
})
export class K9DeclineComponent implements OnDestroy {
	@Input() public loading: boolean;
	@Output() public loadingChange: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() public onCancel: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() public onContinue: EventEmitter<boolean> = new EventEmitter<boolean>();
	public reason: string;
	private destroyed$: Subject<void> = new Subject<void>();

	/**
	 * NgOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * Click handler for Cancel button
	 */
	public cancel () {
		this.onCancel.emit();
	}

	/**
	 * Click handler for Continue button
	 */
	public continue () {
		this.onContinue.emit();
	}
}
