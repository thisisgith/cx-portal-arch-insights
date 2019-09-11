import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to embolden text in a value which matches a provided substring
 * Used in product typeahead to highlight matches
 */
@Pipe({
	name: 'matches',
})
export class MatchesPipe implements PipeTransform {

	/**
	 * Pipe transform, bold text
	 * @param value string input value
	 * @param substring substring value to match on
	 * @returns html with values bolded
	 */
	public transform (value: string, substring: string): string {
		return value.replace(new RegExp(`(${substring})`, 'gi'), '<b>$1</b>');
	}

}
