import { Component, Input } from '@angular/core';

/**
 * Small component for displaying "x / y characters" char count on inputs
 */
@Component({
	host: { class: 'text-right help-block text-muted', role: 'alert' },
	selector: '[char-count]',
	templateUrl: './char-count.component.html',
})
export class CharCountComponent {
	@Input() public value: number;
	@Input() public max: number;
	/** Optional value, minimum length at which to display the message */
	/** By default, always shows */
	@Input() public displayAt?: number;
}
