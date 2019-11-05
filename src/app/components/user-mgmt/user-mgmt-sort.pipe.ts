import { Pipe, PipeTransform } from '@angular/core';
import { SortProps } from './user-mgmt.types';
import { SADetails } from '@sdp-api';
import * as _ from 'lodash-es';

/**
 * Get the initials given a user
 */
@Pipe({
	name: 'userSort',
})
export class UserMgmtSortPipe implements PipeTransform {
	/**
	 * Transform
	 * @param value any[]
	 * @param config SortProps
	 * @returns array of users
	 */
	public transform (value: SADetails[], config: SortProps): SADetails[] {
		if (!config) {
			return value;
		}
		const sorted = _.sortBy(value, config.column);
		if (config.dir === 'asc') {
			return sorted;
		}

		return _.reverse(sorted);
	}
}
