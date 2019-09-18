import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';

/**
	* Perform transform to standard app-wide format of date + time
	* "Sep 10, 2019 2:00 PM PDT"
	* This pipe mostly exists for 2 reasons.
	* 1 - this isn't a standard format supported
	* by a string in the angular datePipe (mediumDate is and works for simple dates across the app)
	* 2 - Locale offset names aren't supported by the angular datePipe, they're always
	* GMT +/- some offset, so you can't get things like PST/PDT/EST, etc.
	* Luxon can give us that.
	*/
@Pipe({
	name: 'dateTime',
})
export class DateTimePipe implements PipeTransform {
	/**
	 * Perform the transform
	 * @param date date to transform, either JS Date or ISO string
	 * @returns formatted date string in MMM d, yyyy h:mm a ZZZZ
	 */
	public transform (date: Date | string): string {
		let dateTime: DateTime;
		if (date instanceof Date) {
			dateTime = DateTime.fromJSDate(date);
		} else {
			dateTime = DateTime.fromISO(date);
		}

		return dateTime.toFormat('MMM d, yyyy h:mm a ZZZZ');
	}
}

/**
 * Module for custom dateTime pipe
 */
@NgModule({
	declarations: [
		DateTimePipe,
	],
	exports: [
		DateTimePipe,
	],
	imports: [
		CommonModule,
	],
})
export class DateTimePipeModule { }
