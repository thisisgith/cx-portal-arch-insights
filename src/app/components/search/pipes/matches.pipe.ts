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
		let searchTerms;
		let completedString;
		// Split the substring with a space and perfrom search
		searchTerms = substring.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, '\\$1')
						.split(' ');
		completedString = value;
		searchTerms.forEach(item => {
			completedString = completedString.replace(
				new RegExp(
					'(?![^&;]+;)(?!<[^<>]*)(' + `${item}` + ')(?![^<>]*>)(?![^&;]+;)', 'i')
				, '<b>$1</b>');
		});

		return completedString;
	}

}
