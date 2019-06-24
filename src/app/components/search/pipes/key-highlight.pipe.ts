import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe for highlighting search term in relevant search results.
 * Replaces <key></key> in the result with bold tags
 */
@Pipe({
	name: 'keyHighlight',
})
export class KeyHighlightPipe implements PipeTransform {

	/**
	 * Perform transform, replacing all <key></key> tags with HTML <b></b> tags
	 * @param value text to transform
	 * @returns transformed text
	 */
	public transform (value: string): string {
		if (!value) {
			return;
		}

		return value.replace(/<key>/g, '<b>')
			.replace(/<\/key>/g, '</b>');
	}

}
