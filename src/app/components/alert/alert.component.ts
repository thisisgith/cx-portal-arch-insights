import {
	Component,
	EventEmitter,
	Inject,
	Input,
	Output,
} from '@angular/core';

/**
 * Box that displays an Alert Messsage
 */
@Component({
	selector: 'alert',
	styleUrls: ['./alert.component.scss'],
	templateUrl: './alert.component.html',
})
export class AlertComponent {
	@Input() public title: string;
	@Input() public visible: boolean | string = true;
	@Input() public showHelpLink = true;
	@Output() public visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
	public supportEmailLink = this.env.supportEmailLink;

	constructor (
		@Inject('ENVIRONMENT') private env,
	) { }

	/**
	 * Hides the alert
	 */
	public hideAlert () {
		this.visible = false;
		this.visibleChange.emit(this.visible);
	}
}
