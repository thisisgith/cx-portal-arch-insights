import { Pipe, PipeTransform } from '@angular/core';
import { SADetails } from '@sdp-api';
import * as _ from 'lodash-es';

/**
 * Fields that the filter term is compared to for matching
 */
const filterableFields = [
	'ccoId',
	'companyName',
	'emailAddress',
	'firstName',
	'lastName',
];

/**
 * Filters the list of users by the above filterable fields
 */
@Pipe({
	name: 'userFilter',
})
export class UserMgmtFilterPipe implements PipeTransform {
	/**
	 * Transform
	 * @param value SADetails[]
	 * @param filter string
	 * @returns array of users
	 */
	public transform (value: SADetails[], filter: string): SADetails[] {
		if (Array.isArray(value) && filter) {
			return value.filter(item => {
				const filterRE = new RegExp(`.*${_.toLower(filter)}.*`);

				return filterableFields.some(field => filterRE.test(_.toLower(item[field])));
			});
		}

		return value;
	}
}
