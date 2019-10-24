import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash-es';

/**
 * Get the initials given a user
 */
@Pipe({
	name: 'initials',
})
export class UserInitialsPipe implements PipeTransform {
	/**
	 * Transform
	 * @param value { lastName: string; firstName: string }
	 * @returns string initials
	 */
	public transform (value: {
		lastName: string;
		firstName: string;
	}): string {
		return `${_.toUpper(
			_.get(value, 'firstName[0]'),
		)}${_.toUpper(
			_.get(value, 'lastName[0]'),
		)}`;
	}
}
