import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
/**
 * to remove invalid html tags
 */
@Pipe({
	name: 'removeInvalidTags',
})

export class RemoveInvalidTagsPipe implements PipeTransform {
	/**
	 * Method for removing invalid html tags
	 * @param value raw data with invalid html
	 * @returns truehtml by removing invalid tags
	 */
	public transform (value) {
		if (value) {
 			let trueHtml = value.replace(/</g, '&lt;');
			trueHtml = trueHtml.replace(/>/g, '&gt;');

			return trueHtml;
		}
	}
}

/**
 * Module for custom dateTime pipe
 */
@NgModule({
	declarations: [
		RemoveInvalidTagsPipe,
	],
	exports: [
		RemoveInvalidTagsPipe,
	],
	imports: [
		CommonModule,
	],
})
export class RemoveInvalidTagsPipeModule { }
