import { Directive, Input } from '@angular/core';

/**
 * Directive to supply default url if original is broken
 * Example:
 * <img src="somebrokenlink" default="/assets/defaultImage.png">
 */
@Directive({
	selector: 'img[default]',
	host: {
		'(error)': 'updateUrl()',
		'[src]': 'src',
	},
})

export class ImageDefaultDirective {
	@Input() public src: string;
	@Input() public default: string;

	/**
	 * Swap the original src with default
	 */
	public updateUrl () {
		this.src = this.default;
	}
}